import { recorder } from '../../behavior/recorder/index';

Component({
  behaviors: [recorder],
  properties: {
    isShow: {
      type: Boolean,
      value: false,
      observer(value) {
        if (value) {
          this.onStart();
        }
      },
    },
  },

  data: {
  },

  pageLifetimes: {
    show() {

    },
    hide() {

    },
  },

  methods: {
    onStart() {
      this.start();
    },
    onStop(opts) {
      const { currentTarget: { dataset: { iscancle = false } = {} } = {} } = opts;
      wx.onVoiceRecorderStop = (res) => {
        this.triggerEvent('stop', { iscancle, ...res });
      };
      this.stop();
    },
    onPause() {
      this.pause();
    },
  },
});
