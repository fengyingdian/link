Component({
  properties: {
    isShow: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    top: wx.getSystemInfoSync().statusBarHeight + 48,
  },

  methods: {
    onTap() {
      this.triggerEvent('hide');
    },
  },
});
