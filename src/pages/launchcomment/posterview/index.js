Component({
  properties: {
    posterUrl: String,
    posterHeight: Number,
  },

  data: {
    statusBar: wx.getSystemInfoSync().statusBarHeight,
    notePre: '保存图片，邀请好友分享观点',
    noteAfter: '已保存至相册，欢迎分享好友',
    isSaved: false,
  },

  attached() {},

  ready() {},

  methods: {
    saveImage() {
      const { posterUrl } = this.data;
      wx.saveImageToPhotosAlbum({
        filePath: posterUrl,
        success: () => {
          wx.showToast({
            title: '保存成功',
          });
          this.setData({
            isSaved: true,
          });
        },
        fail: () => {
          wx.showToast({
            title: '保存失败',
          });
        },
      });
    },

    tapPreviewPoster() {
      const { posterUrl } = this.data;
      wx.previewImage({
        current: posterUrl,
        urls: [posterUrl],
      });
    },

    tapSaveImage() {
      wx.getSetting({
        success: (resSetting) => {
          if (!resSetting.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success: () => {
                this.saveImage();
              },
              fail: () => {
                // Flimi.AppBase().logManager.log('scope.writePhotosAlbum.fail', resSetting, res);
                wx.showModal({
                  title: '提示',
                  content: '未授予保存相册权限',
                  confirmText: '去授权',
                  confirmColor: '#dd2324',
                  cancelText: '不必了',
                  cancelColor: '#999',
                  success: (resp) => {
                    if (resp.confirm) {
                      wx.openSetting();
                    }
                  },
                });
              },
            });
          } else {
            this.saveImage();
          }
        },
      });
    },

    tapClosePage() {
      this.triggerEvent('closePosterView');
    },
  },
});
