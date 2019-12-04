// components/articlecard/index.js
import { postFormId } from '../../service/notification';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    article: {
      type: Object,
      value: {},
      observer() {
        // Flimi.AppBase().logManager.log('articlecard', newVal, oldVal, changedPath, this);
      },
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
  },
});
