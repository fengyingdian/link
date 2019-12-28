import { login } from '../../behavior/login/index';
import { userpostinfo } from '../../behavior/userpostinfo/index';

Component({
  behaviors: [login, userpostinfo],
  properties: {
    postId: {
      type: String,
      value: '',
      observer(val) {
        if (val) {
          this.checkLogin(this.init.bind(this, val));
        }
      },
    },
    navigateTitle: {
      type: String,
      value: 'post preview',
    },
  },
  data: {
    // status bar height, for margin top
    statusBar: wx.getSystemInfoSync().statusBarHeight,

    // navigate z-index fro some reasons
    // we need to set navigate bar's z-index to  0
    navigateIndexZ: 10,

    // refresh comments
    refreshMimes: 0,

    // pined
    isPined: false,
  },

  lifetimes: {
    attached() { },
    moved() { },
    detached() { },
  },

  methods: {
    async init() {
      await this.getPostData();
      await this.updateVisitor();
    },

    async updateVisitor() {
      const { OPENID } = wx.appContext;
      const { userInfo: { nickName, avatarUrl } = {} } = getApp().globalData;
      const { visitors = [], postId } = this.data;
      const isExist = visitors.find(item => item.openId === OPENID);
      if (!isExist) {
        wx.cloud.callFunction({
          name: 'updateUserPostVisitor',
          data: {
            visitors: [
              {
                openId: OPENID,
                nickName,
                avatarUrl,
                createdAt: Date.now(),
              },
              ...visitors,
            ],
            postId,
          },
        })
          .then(Flimi.AppBase().logManager.log)
          .catch(Flimi.AppBase().logManager.error);
      }
    },

    onMime() {
      const that = this;
      const { postId, refreshMimes } = that.data;
      wx.refreshPostMimes = () => {
        that.setData({
          refreshMimes: refreshMimes + 1,
        });
      };
      wx.navigateTo({
        url: `/pages/submitpostmime/index?postId=${postId}`,
      });
    },

    onShareAppMessage() {
      const { OPENID = '' } = wx.appContext || {};
      const { postId = '' } = this.data;
      return {
        path: `/pages/userpost/index?shareOpenId=${OPENID}&postId=${postId}`,
        title: 'link',
        imageUrl: '',
      };
    },
  },
});
