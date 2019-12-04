// components/profileheader/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    logined: {
      type: Boolean,
      value: false,
    },
    avatar: {
      type: String,
      value: 'http://sapp.flipboard.cn/static/assets/ios-user-2.png',
    },
    nickname: {
      type: String,
      value: 'default',
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
    tapArticle(e) {
      // Flimi.AppBase().logManager.log('tapArticle', e);
      this.triggerEvent('article', { flurl: e.currentTarget.dataset.flurl }, {});
    },

    onGotAuthorization(e) {
      this.triggerEvent('authorization', e.detail, {});
    },
  },
});
