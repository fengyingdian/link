// components/articlecard/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    article: {
      type: Object,
      value: {},
      observer() {
        const { data } = this;
        Flimi.AppBase().logManager.info({ data });
      },
    },
    comment: {
      type: Object,
      value: {},
    },
    isLogin: {
      type: Boolean,
      value: false,
    },
    statusId: {
      type: String,
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  lifetimes: {
    created() {},
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onArticle() {
      this.triggerEvent('showarticlecontent', { show: true });
    },
  },
});
