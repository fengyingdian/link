import { login } from '../../behavior/login/index';

Component({
  behaviors: [login],
  properties: {
    isShow: {
      type: Boolean,
      value: false,
      observer(val) {
        if (val) {
          this.checkLogin(this.loadPreviews.bind(this));
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
    navigateTitle: 'square',
    // navigate z-index fro some reasons
    // we need to set navigate bar's z-index to  0
    navigateIndexZ: 10,

    // check if is login
    isLogin: false,
  },

  methods: {
    async loadPreviews() {
      const that = this;
      return wx.cloud.callFunction({
        name: 'getSquarePosts',
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

    onImagePreview(opts) {
      const { detail: { id = '', filePath } = {} } = opts || {};
      const { previews } = this.data;
      const { images = [] } = previews.find(({ _id: itemId }) => itemId === id) || {};
      wx.previewImage({
        current: filePath,
        urls: [...images],
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

    onSubmit() {
      const that = this;
      if (that.data.isLogin) {
        wx.previewRefresh = () => {
          that.loadPreviews();
        };
        wx.navigateTo({
          url: '/pages/submitpost/index',
        });
      } else {
        wx.navigateTo({
          url: '/pages/login/index',
        });
      }
    },

    onShareAppMessage() {
      return {
        path: `/pages/home/index?shareOpenId=${wx.appContext.OPENID}`,
        title: 'link',
        imageUrl: '',
      };
    },
  },
});
