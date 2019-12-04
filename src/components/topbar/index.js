Component({
  properties: {
    title: {
      type: String,
      value: wx.env.navigationBarTitle,
    },
  },

  data: {
    statusBar: wx.getSystemInfoSync().statusBarHeight,
    avatar: '/assets/icons/profile.png',
    isLogin: false,
  },

  attached() {},

  ready() {},

  pageLifetimes: {
    show() {
      const that = this;
      that.setLogin();
      getApp().getUserInfoCallBack = () => that.setLogin();
    },
    hide() {},
    resize() {},
  },

  methods: {
    //
    // ─── private method ────────────────────────────────────────────────────────────
    //
    setLogin() {
      this.setData({
        isLogin: getApp().isLogin(),
      });
    },

    onGetUserInfo(options) {
      const that = this;
      getApp()
        .onGotAuthorization({
          encryptedData: options.detail.encryptedData,
          iv: options.detail.iv,
        })
        .then((res) => {
          if (res) {
            //
            that.setLogin();
            //
            wx.showToast({
              title: '登录成功',
            });
            wx.navigateTo({
              url: '/pages/profile/index',
            });
          } else {
            wx.showToast({
              title: '登录失败',
            });
          }
        });
    },

    onProfile() {
      wx.navigateTo({
        url: '/pages/profile/index',
      });
    },
  },
});
