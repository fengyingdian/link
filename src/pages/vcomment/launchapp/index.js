Component({
  properties: {
    isLaunchAppAuthorization: {
      type: Boolean,
      value: false,
      // observer(newVal, oldVal, changedPath) {
      // console.log("tab-top", newVal, oldVal, changedPath, this)
      // },
    },
  },

  attached() {},

  ready() {},

  methods: {
    launchAppError() {
      // Flimi.AppBase().logManager.log('launchAppError', e.detail.errMsg);
      // if (e.detail.errMsg === 'invalid scene' ||
      // e.detail.errMsg === 'launchApplication:fail launchApplication failed.') {
      this.triggerEvent('invalidScene');
      // }
    },
  },
});
