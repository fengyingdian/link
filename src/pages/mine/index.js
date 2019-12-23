
Component({
  behaviors: [],
  properties: {
    isShow: {
      type: Boolean,
      value: false,
      observer(val) {
        if (val) {
          this.loadPosts();
        }
      },
    },
    showType: {
      type: String,
      value: '', // ['post', 'mime', 'pin']
    },
    refresh: {
      type: Number,
      value: 0,
      observer(val) {
        if (val) {
          const { showType } = this.data;
          if (showType === 'post') {
            this.loadPosts();
          } else if (showType === 'mime') {
            this.loadMimedPosts();
          } else if (showType === 'pin') {
            // this.loadPreviews();
          }
        }
      },
    },
    previews: {
      type: Array,
      value: [],
    },
  },
  data: {
    // status bar height, for margin top
    statusBar: wx.getSystemInfoSync().statusBarHeight,

    // navigate title
    navigateTitle: 'mine',
    // navigate z-index fro some reasons
    // we need to set navigate bar's z-index to  0
    navigateIndexZ: 10,

    // check if is login
    isLogin: false,
  },

  methods: {
    async loadPosts() {
      const that = this;
      const db = await wx.cloud.database();
      await db.collection('user_posts')
        .orderBy('createdAt', 'desc')
        .where({
          _openid: wx.appContext.OPENID,
        })
        .get()
        .then(res => {
          if (res && res.errMsg === 'collection.get:ok' && res.data.length > 0) {
            that.setData({
              previews: res.data,
            });
          }
        });
    },

    async loadMimedPosts() {
      const that = this;
      return wx.cloud.callFunction({
        name: 'getUserMimedPost',
        data: {
          openId: wx.appContext.OPENID,
        },
      })
        .then(res => {
          if (res && res.errMsg === 'cloud.callFunction:ok') {
            that.setData({
              previews: [
                ...res.result,
              ],
            });
          }
        });
    },

    onAudioPlay(opts) {
      const { detail: { id = '' } = {} } = opts || {};
      const { previews } = this.data;
      previews.map((item) => {
        const temp = item;
        const { _id: itemId } = temp;
        temp.audio.isOrder = (id === itemId);
        return temp;
      });
      this.setData({
        previews,
      });
    },
  },
});
