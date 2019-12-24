import { login } from '../../behavior/login/index';
import { formatTime } from '../../utils/util';

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
      await this.getPostPins();
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
            const { createdAt = -1 } = post;
            const timer = formatTime(new Date(createdAt));
            that.setData({
              ...post,
              timer,
            });
          }
        });
    },

    async getPostPins() {
      const { OPENID } = wx.appContext;
      const that = this;
      const { postId = '' } = that.data;
      const db = await wx.cloud.database();
      db.collection('user_post_pins').where({
        postId,
      }).get()
        .then(res => {
          if (res && res.errMsg === 'collection.get:ok' && res.data.length > 0) {
            const { data = [] } = res;
            that.setData({
              pins: data,
              isPind: data.find(({ _openid: openId }) => openId === OPENID),
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
              openId: OPENID,
              nickName,
              avatarUrl,
              createdAt: Date.now(),
            },
            ...visitors.filter(item => item.openid && item.openid !== OPENID),
          ],
          postId,
        },
      })
        .then(Flimi.AppBase().logManager.log)
        .catch(Flimi.AppBase().logManager.error);
    },

    async onPin() {
      const that = this;
      const { isPined = false, postId = '' } = that.data;
      const {
        userInfo: {
          nickName = '', avatarUrl = '',
        } = {},
      } = getApp().globalData;
      const { OPENID } = wx.appContext;
      if (isPined) {
        wx.cloud.callFunction({
          name: 'removeUserPostPin',
          data: {
            openId: OPENID,
            postId,
          },
        }).then(Flimi.AppBase().logManager.log)
          .catch(Flimi.AppBase().logManager.error);
      } else {
        const db = await wx.cloud.database();
        await db.collection('user_post_pins').add({
          data: {
            postId,
            nickName,
            avatarUrl,
            createdAt: Date.now(),
          },
        })
          .then(res => {
            if (res && res.errMsg === 'collection.add:ok') {
              that.setData({
                isPined: true,
              });
            }
          });
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
