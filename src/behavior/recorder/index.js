import { seconds2Timer } from '../../utils/util';

export const recorderManager = wx.getRecorderManager();

export const options = {
  duration: 600000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'aac',
  frameSize: 50,
};

export const recorder = Behavior({
  behaviors: [],
  data: {
    isPause: true,
    seconds: 0,
    timer: seconds2Timer(0),
    tempFilePath: '',
  },
  attached() {
    const that = this;
    recorderManager.onStart(() => {
      Flimi.AppBase().logManager.log('recorder start');
      that.setData({
        isPause: false,
      });
    });

    recorderManager.onPause(() => {
      Flimi.AppBase().logManager.log('recorder pause');
    });

    recorderManager.onStop((res) => {
      Flimi.AppBase().logManager.log('recorder stop', res);
      const { tempFilePath = '' } = res;
      clearInterval(that.interval);
      if (wx.onVoiceRecorderStop) {
        wx.onVoiceRecorderStop(tempFilePath);
      }

      // do sth

      that.setData({
        isPause: false,
        seconds: 0,
        timer: seconds2Timer(0),
      });
    });

    recorderManager.onFrameRecorded((res) => {
      const { frameBuffer } = res;
      Flimi.AppBase().logManager.log('frameBuffer.byteLength', frameBuffer.byteLength);
    });
  },
  detached() {
    this.stop();
  },
  methods: {
    start() {
      recorderManager.start(options);
      const that = this;
      this.interval = setInterval(() => {
        if (!this.data.isPause) {
          const { seconds = 0 } = that.data;
          const s = seconds + 1;
          this.setData({
            seconds: s,
            timer: seconds2Timer(s),
          });
        }
      }, 1000);
    },

    stop() {
      recorderManager.stop();
    },

    pause() {
      const { isPause } = this.data;
      this.setData({
        isPause: !isPause,
      });
      if (isPause) {
        recorderManager.resume();
      } else {
        recorderManager.pause();
      }
    },
  },
});

export default {};
