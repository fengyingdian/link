
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
    selects: ['post', 'mime'],

    selectCursorTitle: 'post',
  },

  methods: {
    async loadPosts() {
      const that = this;
      return wx.cloud.callFunction({
        name: 'getUserPosts',
        data: {
          openId: wx.appContext.OPENID,
        },
      })
        .then(res => {
          if (res && res.errMsg === 'cloud.callFunction:ok' && res.result.length > 0) {
            that.setData({
              previews: [
                ...res.result,
              ],
            });
          }
        });
    },

    async loadMimedPosts() {
      const that = this;
      return wx.cloud.callFunction({
        name: 'getUserMimedPosts',
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

    onRemove(opts) {
      const that = this;
      const { previews = [] } = this.data;
      const { detail: { postId = '' } = {} } = opts || {};
      wx.cloud.callFunction({
        name: 'updateUserPostStatus',
        data: {
          postId,
          isRemoved: true,
        },
      })
        .then((res) => {
          if (res && res.errMsg === 'cloud.callFunction:ok') {
            that.setData({
              previews: [
                ...previews.filter(({ _id: id }) => id !== postId),
              ],
            });
          }
        })
        .catch(Flimi.AppBase().logManager.error);
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
