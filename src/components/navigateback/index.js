Component({
  properties: {},

  data: {
    statusBar: wx.getSystemInfoSync().statusBarHeight,
  },

  attached() { },

  ready() {
    this.setData({
      goBack: Boolean(getCurrentPages().length > 1) && this.data.isShowGoBack,
    });
  },

  methods: {
    tapGoBack() {
      wx.navigateBack();
    },
  },
});
