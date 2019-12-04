import { postFormId } from '../../../../service/notification';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    statusId: {
      type: String,
      value: '',
    },
    url: {
      type: String,
      value: '',
    },
    avatar: {
      type: String,
      value: '',
    },
    nickname: {
      type: String,
      value: '',
    },
    description: {
      type: String,
      value: '',
    },
    verifiedType: {
      type: String,
      value: '',
    },
    time: {
      type: String,
      value: '',
    },
    comment: {
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
    commentCount: {
      type: String,
      value: '',
    },
    index: {
      type: Number,
      value: -1,
      observer(newValue) {
        if (newValue) {
          this.onShowImage();
        }
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  attached() {},

  ready() {
    // // Flimi.AppBase().logManager.log('articlecardE', this.data.data);
  },
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

    onStatus(options) {
      this.onPostFormId(options);
      const { statusId = '' } = this.data;
      wx.navigateTo({
        url: `/pages/userstatus/index?statusId=${statusId}`,
      });
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
