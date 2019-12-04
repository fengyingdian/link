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
    influencer: {
      type: Object,
      value: {},
    },
    cover: {
      type: String,
      value: '',
    },
    oriComments: {
      type: Array,
      value: [],
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
    screenHeight:
    {
      type: Number,
      value: 100,
    },
    isShowScrollView: {
      type: Boolean,
      value: false,
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
    maxlength: 100,

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
    // ─── CLAP COMMENT ────────────────────────────────────────────────
    //

    onClapComment() {
      this.triggerEvent('clapcomment');
    },

    //
    // ─── RESPOND COMMENT ─────────────────────────────────────────────
    //

    onRespondComment(opts) {
      this.triggerEvent('respondcomment', {
        ...opts.detail,
      });
    },

    //
    // ─── SHARE COMMENT ───────────────────────────────────────────────
    //

    onShareComment(opts) {
      this.triggerEvent('sharecomment', {
        ...opts.detail,
      });
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

    onScrollUpper(opts) {
      Flimi.AppBase().logManager.log('upper', opts);
      this.setData({
        isShowScrollView: false,
      });
    },

    onScrollLower(opts) {
      Flimi.AppBase().logManager.log('lower', opts);
    },
  },
});
