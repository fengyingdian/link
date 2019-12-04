Component({
  properties: {
    commentTips: {
      type: String,
      value: '在这里写下你的想法',
    },
    shareTips: {
      type: String,
      value: '分享好友，请大家一起讨论',
    },
    url: {
      type: String,
      value: '',
    },
    title: {
      type: String,
      value: '',
    },
    isLogin: {
      type: Boolean,
      value: false,
    },
  },

  attached() { },

  ready() {
    this.setData({
      isIphoneX: wx.isIphoneX(),
    });
  },

  methods: {
    onGotAuthorization(options) {
      getApp()
        .onGotAuthorization({
          encryptedData: options.detail.encryptedData,
          iv: options.detail.iv,
        })
        .then((res) => {
          if (res) {
            wx.showToast({
              title: '登录成功',
            });
            this.onLaunchComment();
          } else {
            wx.showModal({
              title: '登录失败',
              content: '请稍后重试~',
              showCancel: false,
              confirmText: '好的',
              confirmColor: '#dd2324',
            });
          }
        });
    },

    onLaunchComment() {
      this.triggerEvent('launchcomment');
    },

    onShare() {
      this.triggerEvent('sharecomment');
    },
  },
});
