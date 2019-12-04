// components/influencerheader/index.js
import { postFormId } from '../../../service/notification';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    influencer: {
      type: Object,
      value: {
        avatar: {
          type: String,
          value: 'http://sapp.flipboard.cn/static/assets/ios-user-2.png',
        },
        nickname: {
          type: String,
          value: 'break',
        },
        city: {
          type: String,
          value: '北京',
        },
        gender: {
          type: Number,
          value: 0,
        },
        description: {
          type: String,
          value: '',
        },
      },
      observer() {
        if (this.data.influencer) {
          this.setData({
            genderSrc: this.data.influencer.gender === 1 ? '/assets/icons/boy.png' : '/assets/icons/girl.png',
          });
        }
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    genderSrc: '/assets/icons/gender.png',
  },

  attached() {},

  ready() {},

  pageLifetimes: {
    show() {},
    hide() {},
    resize() {},
  },
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
      // Flimi.AppBase().logManager.log('onCircle: ', options);

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

    tapArticle(e) {
      // Flimi.AppBase().logManager.log('tapArticle', e);
      this.triggerEvent('article', { flurl: e.currentTarget.dataset.flurl }, {});
    },

    onGotAuthorization(e) {
      this.triggerEvent('authorization', e.detail, {});
    },
  },
});
