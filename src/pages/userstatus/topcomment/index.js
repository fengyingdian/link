// components/articlecard/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    url: {
      type: String,
      value: '',
    },
    comments: {
      type: Array,
      value: [],
    },
    selectedCommentId: {
      type: String,
      value: '',
    },
    isLogin: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // max length of showing comments
    maxlength: 3,
  },

  lifetimes: {
    created() {},
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //
    // ─── CLAP COMMENT ────────────────────────────────────────────────
    //

    onClapComment() {
      this.triggerEvent('refreshcomments');
    },

    //
    // ─── RESPOND COMMENT ─────────────────────────────────────────────
    //

    onRespondComment(ops) {
      const { detail = {} } = ops;
      this.triggerEvent('respondcomment', { ...detail });
    },

    //
    // ─── SHARE COMMENT ───────────────────────────────────────────────
    //

    onShareComment(opts) {
      if (getApp().getShareCommentCallback) {
        getApp().getShareCommentCallback(opts.detail);
      }
    },

    //
    // ─── SHOW MORE COMMENT ───────────────────────────────────────────
    //

    onLoadMoreComment() {
      this.setData({
        maxlength: this.data.maxlength + 10,
      });
      this.triggerEvent('loadmorecomment');
    },
  },
});
