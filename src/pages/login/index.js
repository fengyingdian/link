import { login } from '../../behavior/login/index';

const app = getApp();

Component({
  behaviors: [login],
  properties: {
    isShowGoBack: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    // status bar height, for margin top
    statusBar: wx.getSystemInfoSync().statusBarHeight,

    // navigate title
    navigateTitle: 'login',
    // navigate z-index fro some reasons
    // we need to set navigate bar's z-index to  0
    navigateIndexZ: 10,

    // check if is login
    isLogin: false,
  },

  methods: {
    onReady() {},

    async onGotAuthorization(opts) {
      const { errMsg = '', userInfo = {} } = opts.detail;
      if (errMsg === 'getUserInfo:fail auth deny') {
        return;
      }
      const { userInfo: localData } = app.globalData;
      if (localData && userInfo !== localData) {
        await app.updateUserInfo(userInfo);
      } else if (!localData) {
        await app.addUserInfo(userInfo);
      }
      if (app.isLogin()) {
        wx.navigateBack({
          delta: 1,
        });
      }
    },
  },
});
