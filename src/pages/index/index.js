import { login } from '../../behavior/login/index';

Component({
  behaviors: [login],
  properties: {
  },
  data: {
    // status bar height, for margin top
    statusBar: wx.getSystemInfoSync().statusBarHeight,

    minWidth: 82,

    maxWidth: wx.getSystemInfoSync().windowWidth - 64 - 82,

    // navigate title
    navigateTitle: '',
    // navigate z-index fro some reasons
    // we need to set navigate bar's z-index to  0
    navigateIndexZ: 10,

    // check if is login
    isLogin: false,

    // is mine tab
    isMine: true,

  },

  methods: {
    async onLoad() {
      const that = this;
      that.checkLogin();
    },

    async onChangeTab(opts) {
      const { target: { dataset: { ismine = false } } } = opts || {};
      const { isMine } = this.data;
      if (isMine && isMine === ismine) {
        this.onSubmit();
      } else {
        this.setData({
          isMine: ismine,
        });
      }
    },

    onSubmit() {
      const that = this;
      if (that.data.isLogin) {
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
