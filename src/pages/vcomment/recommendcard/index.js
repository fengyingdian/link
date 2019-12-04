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
      observer(newValue) {
        if (newValue && newValue.id) {
          this.onShowImage();
        }
      },
    },
    recommendComments: {
      type: Array,
      value: [],
    },
    isLogin: {
      type: String,
      value: '',
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

    onArticle(options) {
      this.onPostFormId(options);
      const {
        article: { authorId, id: articleId },
      } = this.data;
      wx.navigateTo({
        url: `/pages/vcomment/index?articleId=${articleId}&authorId=${authorId}`,
      });
    },

    onCoverError(options) {
      Flimi.AppBase().logManager.log(options.detail);
    },

    onCoverLoad() {
      this.setData({
        coverShow: true,
      });
    },
  },
});
