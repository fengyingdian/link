import { postFormId } from '../../../service/notification';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    article: {
      type: Object,
      value: null,
      observer(newValue) {
        if (newValue) {
          this.onShowImage();
        }
      },
    },
    index: {
      type: Number,
      value: -1,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    onShowImage() {
      const that = this;
      const { index, article } = that.data;
      if (index >= 0 && article) {
        setTimeout(
          () => that.setData({
            cover: article.coverSrc,
          }),
          (index + 1) * 400,
        );
      }
    },

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

    onInfluencer() {
      const { influencer } = this.data.article;
      if (influencer) {
        wx.navigateTo({
          url: `/pages/influencer/index?userid=${influencer.authorId}&flType=`,
        });
      }
    },

    onArticle(options) {
      this.onPostFormId(options);

      const { article } = this.data;
      const { authorId, id: articleId } = article;
      wx.navigateTo({
        url: `/pages/vcomment/index?articleId=${articleId}&authorId=${authorId}`,
      });
      this.triggerEvent('article', { article }, { bubbles: true, composed: true });
    },

    onCoverError(options) {
      Flimi.AppBase().logManager.log(options.detail);
    },

    onCoverLoad() {
      this.setData({
        maskHide: true,
      });
    },
  },
});
