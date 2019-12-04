// components/articlecard/index.js
import { init } from '../../../common/js/aritcle/init';
import { draw } from '../../../common/js/aritcle/draw';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    article: {
      type: Object,
      value: {},
    },
    url: {
      type: String,
      value: '',
    },
    influencer: {
      type: Object,
      value: {},
    },
    cover: {
      type: String,
      value: '',
    },
    topComments: {
      type: Array,
      value: [],
    },
    vipComments: {
      type: Array,
      value: [],
    },
    norComments: {
      type: Array,
      value: [],
    },
    isLogin: {
      type: String,
      value: '',
    },
    authorId: {
      type: String,
      value: '',
    },
    imageUrl: {
      type: String,
      value: '',
    },
    selectedCommentId: {
      type: String,
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // comments have been seperated into
    // three types, the array below is
    // the second and third groups' title
    commentListTitles: ['精选讨论', '最新讨论'],
    // max length of showing comments
    maxlength: 3,
  },

  lifetimes: {
    created() {
      this.onRegister();
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //
    // ─── REGISTER ────────────────────────────────────────────────────
    //

    onRegister() {
      Object.keys(init).forEach((key) => {
        this[key] = init[key];
      });
      Object.keys(draw).forEach((key) => {
        this[key] = draw[key];
      });
    },

    //
    // ─── ARTICLE ─────────────────────────────────────────────────────
    //

    onArticle() {
      getApp().onCommentSubmitCallback = () => {
        wx.showToast({
          title: '发表成功',
          duration: 1500,
        });
        this.fetchArticleComment();
      };
      this.fetchArticleComment();
    },

    //
    // ─── CLAP COMMENT ────────────────────────────────────────────────
    //

    onClapComment() {
      this.fetchArticleComment();
    },

    //
    // ─── RESPOND COMMENT ─────────────────────────────────────────────
    //

    onRespondComment(ops) {
      this.fetchArticleComment();
      this.setData({
        repondFocus: true,
        respondComment: ops.detail,
        isShowRespondComment: true,
      });
    },

    onRespondCommentSubmit(ops) {
      const { refresh } = ops.detail;
      if (refresh) {
        this.fetchArticleComment();
      }
      this.setData({
        respondFocus: false,
        isShowRespondComment: false,
      });
    },

    onCloseRespondComment() {
      this.setData({
        respondFocus: false,
        isShowRespondComment: false,
      });
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
        maxlength: this.data.maxlength + 20,
      });
      this.triggerEvent('loadmorecomment');
    },
  },
});
