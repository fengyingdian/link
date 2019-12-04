/*
 * File: app.js
 * File Created: Monday, 18th February 2019 10:38:49 am
 * Author: Break <fengyingdian@126.com>
 */

// app.js
import {
  isLogin, login as flLogin, getSessionKey,
} from './service/api';
import { login as wxLogin } from './service/wxpromisify';
import AppBase from './Base';
import Settings from './Settings';

const updateManager = wx.getUpdateManager();

updateManager.onCheckForUpdate(() => {});

updateManager.onUpdateReady(() => {
  wx.showModal({
    title: '更新提示',
    content: '发现红板报新版本~',
    showCancel: false,
    success: () => {
      updateManager.applyUpdate();
    },
  });
});

updateManager.onUpdateFailed(() => {
  wx.showToast({
    title: '更新失败',
  });
});


App({
  onLaunch() {
    this.base = new AppBase();
    this.base.initialize();

    this.onLaunchCount();

    this.onIsLogin();
  },

  onShow(ops) {
    this.onLaunchAppAuthorization(ops);

    // check sessionKey
    this.onCheckSessionKey();
  },

  onLaunchCount() {
    try {
      this.globalData.launchCount = wx.getStorageSync(Settings.LAUNCH_COUNT);
    } catch (e) {
      this.globalData.launchCount = 0;
    }
    if (!this.globalData.launchCount) {
      this.globalData.launchCount = 0;
    }
    wx.setStorage({
      key: Settings.LAUNCH_COUNT,
      data: this.globalData.launchCount + 1,
    });
  },

  onCheckSessionKey() {
    const that = this;
    wx.checkSession({
      success: () => {
        // session_key 未过期，并且在本生命周期一直有效
      },
      fail: () => {
        // session_key 已经失效，需要重新执行登录流程
        that.getSessionKey();
      },
    });
  },

  onLaunchAppAuthorization(ops) {
    const { scene } = ops;
    if (scene === 1069) {
      this.globalData.isLaunchAppAuthorization = true;
    } else if (scene === 1036) {
      this.globalData.isLaunchAppAuthorization = true;
    } else if (scene !== 1089 && scene !== 1090 && scene !== 1038) {
      this.globalData.isLaunchAppAuthorization = false;
    }
  },

  onIsLogin() {
    const that = this;
    wxLogin()
      .then(({ code }) => isLogin(code))
      .then(({
        data: {
          status = -1, exist: user = null, token = '', openId = '', sessionKey = '', version = '',
        },
      }) => {
        if (status === 0) {
          if (user) {
            that.globalData.userInfo = {
              token,
              ...user,
            };
            if (this.getUserInfoCallBack) {
              this.getUserInfoCallBack();
            }
          }
          if (sessionKey) {
            that.globalData.sessionKey = sessionKey;
          }
          if (openId) {
            that.globalData.openId = openId;
          }
          if (version) {
            that.globalData.version = version;
          }
        }
      });
  },

  onGotAuthorization(ops) {
    const that = this;
    if (!that.globalData.sessionKey) {
      return that.getSessionKey().then((res) => {
        if (res) {
          return that.login(ops);
        }
        return false;
      });
    }
    return that.login(ops);
  },

  getSessionKey() {
    const that = this;
    return wxLogin()
      .catch(() => false)
      .then(({ code }) => getSessionKey(code))
      .then((res) => {
        const { sessionKey } = res.data;
        if (sessionKey) {
          that.globalData.sessionKey = sessionKey;
          return true;
        }
        return false;
      })
      .catch(() => false);
  },

  login(ops) {
    const that = this;
    const { sessionKey: code } = that.globalData;
    const { encryptedData, iv } = ops;
    const operateReturnedData = (res) => {
      if (res && res.data && res.data.status === 0) {
        const { data = {} } = res;
        that.globalData.userInfo = {
          ...data.user,
          token: data.token,
        };
        that.globalData.openId = data.user.openId;
        if (that.getUserInfoCallBack) {
          that.getUserInfoCallBack();
        }
        return true;
      }
      return false;
    };
    return flLogin({ code, encryptedData, iv })
      .then(res => operateReturnedData(res))
      .catch(() => false);
  },

  isLogin() {
    const { userInfo } = this.globalData;
    if (userInfo) {
      return userInfo.id && userInfo.token;
    }
    return false;
  },

  globalData: {
    openId: null,
    sessionKey: null,
    userInfo: null,
    launchCount: 0,
    isShownNewUserNotification: false,
    isLaunchAppAuthorization: false,
    version: '',
  },
});
