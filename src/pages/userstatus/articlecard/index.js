// components/articlecard/index.js
import { postFormId } from '../../../service/notification';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLogin: {
      type: Boolean,
      value: false,
      observer() {
        const { data } = this;
        Flimi.AppBase().logManager.info({ data });
      },
    },
    statusId: {
      type: String,
      value: '',
    },
    cover: {
      type: String,
      value: '',
    },
    title: {
      type: String,
      value: '',
    },
    publisherDisplayName: {
      type: String,
      value: '',
    },
    publishedTime: {
      type: String,
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    windowHeight: wx.getSystemInfoSync().windowHeight,
  },

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

    onArticle() {
      this.triggerEvent('article');
      // wx.navigateTo({
      //   url: `/pages/userstatusarticle/index?scene=${encodeURIComponent(this.data.statusId)}`,
      // });
    },
  },
});
