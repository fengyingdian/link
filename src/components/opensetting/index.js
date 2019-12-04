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
    tapOpenSetting() {
      wx.openSetting();
      // Flimi.AppBase().logManager.log('openSetting', e);
      this.triggerEvent('openSetting', {}, {});
    },
  },
});
