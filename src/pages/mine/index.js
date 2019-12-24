
Component({
  behaviors: [],
  properties: {
    isShow: {
      type: Boolean,
      value: false,
      observer(val) {
        if (val) {
          const that = this;
          that.loadPosts();
          wx.previewRefresh = () => {
            that.setData({
              selectCursorTitle: 'post',
              selectCursorColor: '#000',
            });
            that.loadPosts();
          };
        }
      },
    },
    showType: {
      type: String,
      value: '', // ['post', 'mime', 'pin']
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

    // offset left
    offsetLeft: 0,

    // select list
    selects: ['post', 'mime', 'pin'],

    selectCursorTitle: 'post',
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

    async loadPinedPosts() {
      const that = this;
      const db = await wx.cloud.database();
      await db.collection('user_post_pins')
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

    async onSelectChange(opts) {
      Flimi.AppBase().logManager.log({ opts });
      const {
        target: { offsetLeft = 0, dataset: { title = '' } } = {},
      } = opts;
      this.setData({
        selectCursorTitle: '',
        selectCursorColor: '#fff',
        offsetLeft,
      });
      if (title === 'post') {
        this.loadPosts();
      } else if (title === 'mime') {
        this.loadMimedPosts();
      } else if (title === 'pin') {
        this.loadPinedPosts();
      }
      setTimeout(() => {
        this.setData({
          selectCursorTitle: title,
          selectCursorColor: '#000',
        });
      }, 150);
    },
  },
});
