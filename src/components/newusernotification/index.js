Component({
  data: {
    isShow: false,
  },

  attached() {},

  ready() {
    const that = this;
    setTimeout(() => {
      const { launchCount, isShownNewUserNotification } = getApp().globalData;
      that.setData({
        isShow: launchCount < 1 && !isShownNewUserNotification,
      });
      getApp().globalData.isShownNewUserNotification = true;
    }, 2000);
  },

  methods: {
    onHide() {
      this.setData({
        isShow: false,
      });
    },
  },
});
