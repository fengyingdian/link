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
    launchAppError(e) {
      // Flimi.AppBase().logManager.log('launchContact', e.detail.errMsg);
      if (e.detail.errMsg === 'invalid scene') {
        this.triggerEvent('invalidScene', {}, {});
      }
    },
  },
});
