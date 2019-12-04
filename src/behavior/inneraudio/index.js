import { seconds2Timer } from '../../utils/util';

const innerAudioContext = wx.createInnerAudioContext();

export const inneraudio = Behavior({
  behaviors: [],
  properties: {
    src: {
      type: String,
      value: '',
    },
    startTime: {
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
  },
  data: {
    isPlay: false,
    timer: seconds2Timer(0),
  },
  attached() {
    const that = this;
    innerAudioContext.onPlay(() => {
      Flimi.AppBase().logManager.log('innerAudio play');
      that.setData({
        isPlay: true,
      });
    });

    innerAudioContext.onStop((res) => {
      Flimi.AppBase().logManager.log('innerAudio stop', res);
      that.end();
    });

    innerAudioContext.onEnded((res) => {
      Flimi.AppBase().logManager.log('innerAudio end', res);
      that.end();
      that.setData({
        startTime: 0,
        timer: seconds2Timer(0),
      });
    });

    innerAudioContext.onError((res) => {
      Flimi.AppBase().logManager.log('innerAudio error', res.errMsg, res.errCode);
      that.end();
      that.setData({
        startTime: 0,
        timer: seconds2Timer(0),
      });
    });
  },
  detached() {
    Flimi.AppBase().logManager.log('innerAudio detached');
  },

  methods: {
    init() {
      this.setData({
        startTime: 0,
      });
      const {
        src, autoplay = false, loop = false, obeyMuteSwitch = false, mixWithOther = false,
      } = this.data;
      wx.setInnerAudioOption({ mixWithOther, obeyMuteSwitch });
      (() => {
        innerAudioContext.src = src;
        innerAudioContext.autoplay = autoplay;
        innerAudioContext.loop = loop;
      })();
    },

    play() {
      const that = this;
      const { startTime = 0 } = that.data;
      innerAudioContext.seek(startTime);
      innerAudioContext.play();
      this.interval = setInterval(() => {
        if (this.data.isPlay) {
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
      innerAudioContext.stop();
    },

    end() {
      clearInterval(this.interval);
      this.setData({
        isPlay: false,
      });
    },

    // pause() {
    //   const { isPause } = this.data;
    //   this.setData({
    //     isPause: !isPause,
    //   });
    //   if (isPause) {
    //     innerAudioContext.play();
    //   } else {
    //     innerAudioContext.pause();
    //   }
    // },
  },
});

export default {};
