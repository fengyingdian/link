Component({
  properties: {
    isShow: {
      type: Boolean,
      value: false,
    },
    zIndex: {
      type: Number,
      value: 20,
      observer(newValue) {
        Flimi.AppBase().logManager.log({ newValue });
      },
    },
  },

  data: {
    // status bar height, for margin top
    statusBar: wx.getSystemInfoSync().statusBarHeight,
    // window height
    windowHeight: wx.getSystemInfoSync().windowHeight,
    // window width
    windowWidth: wx.getSystemInfoSync().windowWidth,
  },

  methods: {
    onCancle() {
      this.triggerEvent('hide');
    },
  },
});
