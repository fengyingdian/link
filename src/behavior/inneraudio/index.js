import { seconds2Timer } from '../../utils/util';

export const inneraudio = Behavior({
  behaviors: [],
  properties: {
    src: {
      type: String,
      value: '',
      observer(val) {
        if (val) {
          this.init();
        }
      },
    },
    startTime: {
      type: Number,
      value: 0,
    },
    duration: {
      type: Number,
      value: 0,
      observer(val) {
        if (val) {
          this.setData({
            durationTimer: seconds2Timer(parseInt(val / 1000, 10)),
          });
        }
      },
    },
    fileSize: {
      type: Number,
      value: 0,
    },
    autoplay: {
      type: Boolean,
      value: false,
    },
    loop: {
      type: Boolean,
      value: false,
    },
    obeyMuteSwitch: {
      type: Boolean,
      value: false,
    },
    mixWithOther: {
      type: Boolean,
      value: false,
    },
    isPlaying: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    timer: seconds2Timer(0),
    durationTimer: seconds2Timer(0),
  },
  attached() {
    Flimi.AppBase().logManager.log('attached');
  },
  detached() {
    Flimi.AppBase().logManager.log('innerAudio detached');
  },

  methods: {
    init() {
      Flimi.AppBase().logManager.log('init');
      this.setData({
        startTime: 0,
      });
      const that = this;
      const {
        src = '',
        autoplay = false,
        loop = false,
        obeyMuteSwitch = false,
        mixWithOther = false,
      } = that.data;
      wx.setInnerAudioOption({ mixWithOther, obeyMuteSwitch });

      that.innerAudioContext = wx.createInnerAudioContext();
      that.innerAudioContext.onPlay(() => {
        Flimi.AppBase().logManager.log('innerAudio play', this.innerAudioContext.src);
        that.setData({
          isPlaying: true,
        });
      });

      that.innerAudioContext.onStop((res) => {
        Flimi.AppBase().logManager.log('innerAudio stop', res);
        that.setData({
          isPlaying: false,
        });
      });

      that.innerAudioContext.onEnded((res) => {
        Flimi.AppBase().logManager.log('innerAudio end', res);
        that.end();
      });

      that.innerAudioContext.onError((res) => {
        Flimi.AppBase().logManager.log('innerAudio error', res.errMsg, res.errCode);
        that.end();
      });

      that.innerAudioContext.src = src;
      that.innerAudioContext.autoplay = autoplay;
      that.innerAudioContext.loop = loop;
    },

    play() {
      const that = this;
      const { startTime = 0 } = that.data;
      this.innerAudioContext.seek(startTime);
      this.innerAudioContext.play();

      if (this.interval) {
        return;
      }
      this.interval = setInterval(() => {
        const { isPlaying } = this.data;
        if (isPlaying) {
          const { startTime: cur = 0 } = that.data;
          const s = cur + 1;
          this.setData({
            startTime: s,
            timer: seconds2Timer(s),
          });
        }
      }, 1000);
    },

    stop() {
      this.innerAudioContext.stop();
    },

    end() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
      this.setData({
        isPlaying: false,
        startTime: 0,
        timer: seconds2Timer(0),
      });
    },

    // pause() {
    //   const { isPause } = this.data;
    //   this.setData({
    //     isPause: !isPause,
    //   });
    //   if (isPause) {
    //     this.innerAudioContext.play();
    //   } else {
    //     this.innerAudioContext.pause();
    //   }
    // },
  },
});

export default {};
