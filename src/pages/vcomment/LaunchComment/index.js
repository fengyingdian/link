Component({
  properties: {
    tips: {
      type: String,
      value: '发表观点',
    },
    articleId: {
      type: String,
      value: '',
    },
    title: {
      type: String,
      value: '',
    },
    imageUrl: {
      type: String,
      value: '',
    },
    authorId: {
      type: String,
      value: '',
    },
    isLogin: {
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
      const {
        articleId, title, imageUrl, authorId,
      } = this.data;
      wx.navigateTo({
        url: `/pages/launchcomment/index?articleId=${articleId}&title=${title}&imageUrl=${imageUrl}&authorId=${authorId}`,
      });
      this.triggerEvent('launchComment');
    },
  },
});
