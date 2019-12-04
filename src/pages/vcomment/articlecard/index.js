// components/articlecard/index.js
import { postFormId } from '../../../service/notification';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    article: {
      type: Object,
      value: {},
      observer() {
        this.setData({
          isLogin: getApp().isLogin(),
        });
      },
    },
    url: {
      type: String,
      value: '',
    },
    coverUrl: {
      type: String,
      value: '',
    },
    isLogin: {
      type: Boolean,
      value: false,
    },
    showCircle: {
      type: Boolean,
      value: true,
    },
    // for webview
    authorId: {
      type: String,
      value: '',
    },
    imageUrl: {
      type: String,
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  attached() {},

  ready() {},
  /**
   * 组件的方法列表
   */
  methods: {
    onPostFormId(options) {
      const { formId } = options.detail;
      const { openId } = getApp().globalData;
      if (openId && formId) {
        postFormId({
          openId,
          formId,
          timestamp: new Date().getTime(),
        });
      }
    },

    onCircle(options) {
      this.onPostFormId(options);
      const {
        dataset: { name, id },
      } = options.currentTarget;
      if (name) {
        wx.navigateTo({
          url: `/pages/circle/index?name=${name}&id=${id}`,
        });
      }
    },

    onArticle() {
      const {
        url,
        authorId,
      } = this.data;
      this.triggerEvent('article');
      wx.navigateTo({
        url: `/pages/article/index?url=${url}&authorId=${authorId}`,
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
            wx.showToast({
              title: '登录成功',
            });
            that.setData({
              isLogin: getApp().isLogin(),
            });
            that.onArticle();
          } else {
            wx.showModal({
              title: '登录失败',
              content: '请稍后再尝试~',
              showCancel: false,
              confirmText: '知道了',
              confirmColor: '#dd2324',
              success: () => {},
            });
          }
        });
    },
  },
});
