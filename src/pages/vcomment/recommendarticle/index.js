// components/articlecard/index.js
import { init } from '../../../common/js/aritcle/init';

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
      observer(newValue) {
        if (newValue) {
          this.onProcessComment();
        }
      },
    },
    influencer: {
      type: Object,
      value: {},
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

  lifetimes: {
    created() {
      this.onRegister();
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onRegister() {
      Object.keys(init).forEach((key) => {
        this[key] = init[key];
      });
    },

    onProcessComment() {
      // const that = this;
      // that.fetchArticleComment().then(() => {
      //   const primeComments = that.data.vipComments.concat(that.data.norComments);
      //   const isShowPrimeComment = (() => {
      //     if (primeComments.length > 0) {
      //       const [prime] = primeComments;
      //       if (prime.text && prime.text.length > 30) {
      //         that.setData({
      //           primeComments: [prime],
      //         });
      //         return true;
      //       }
      //     }
      //     return false;
      //   })();
      //   that.setData({
      //     isShowPrimeComment,
      //   });
      // });
    },
  },
});
