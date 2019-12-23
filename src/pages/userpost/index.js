import { login } from '../../behavior/login/index';

Component({
  behaviors: [login],
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

    // check if is login
    isLogin: false,

    // refresh comments
    refreshMimes: 0,
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

    async getPostData() {
      const that = this;
      const { postId = '' } = this.data;
      const db = await wx.cloud.database();
      await db.collection('user_posts')
        .where({
          _id: postId,
        })
        .get()
        .then(res => {
          if (res && res.errMsg === 'collection.get:ok' && res.data.length > 0) {
            const [post = {}] = res.data;
            that.setData({
              ...post,
            });
          }
        });
    },

    async updateVisitor() {
      const { OPENID } = wx.appContext;
      const { userInfo: { nickName, avatarUrl } = {} } = getApp().globalData;
      const { visitors = [], postId } = this.data;
      wx.cloud.callFunction({
        name: 'updateUserPost',
        data: {
          visitors: [
            {
              openid: OPENID,
              nickName,
              avatarUrl,
            },
            ...visitors.filter(item => item.openid && item.openid !== OPENID),
          ],
          postId,
        },
      })
        .then(Flimi.AppBase().logManager.log)
        .catch(Flimi.AppBase().logManager.error);
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
