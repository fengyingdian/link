Component({
  properties: {
    isShow: {
      type: Boolean,
      value: false,
    },
  },

  attached() {},

  ready() {
    this.setData({
      isIphoneX: wx.isIphoneX(),
    });
  },

  methods: {
    onPoster() {
      this.triggerEvent('showPoster');
    },

    onHide() {
      this.triggerEvent('hide');
    },
  },
});
