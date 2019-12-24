/*
 * File: app.js
 * File Created: Monday, 18th February 2019 10:38:49 am
 * Author: Break <fengyingdian@126.com>
 */

import AppBase from './Base';

const updateManager = wx.getUpdateManager();

updateManager.onCheckForUpdate(() => { });

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
  async onLaunch() {
    this.base = new AppBase();
    this.base.initialize();

    await this.initWxContext();
    await this.initUserInfo();
  },

  onShow() {
  },

  async initWxContext() {
    return wx.cloud.callFunction({
      name: 'getWxContext',
    })
      .then(res => {
        if (res && res.errMsg === 'cloud.callFunction:ok') {
          wx.appContext = {
            ...res.result,
          };
        }
      });
  },

  async initUserInfo() {
    const that = this;
    const db = await wx.cloud.database();
    await db.collection('wechat_users').where({
      _openid: wx.appContext.OPENID,
    }).get().then(res => {
      if (res && res.errMsg === 'collection.get:ok' && res.data.length > 0) {
        const [user] = res.data;
        that.globalData.userInfo = {
          ...user,
        };
        if (that.getUserInfoCallBack) {
          that.getUserInfoCallBack(true);
        }
      } else if (that.getUserInfoCallBack) {
        that.getUserInfoCallBack(false);
      }
    })
      .catch(() => {
        if (that.getUserInfoCallBack) {
          that.getUserInfoCallBack(false);
        }
      });
  },

  async addUserInfo(userInfo) {
    const that = this;
    const db = await wx.cloud.database();
    await db.collection('wechat_users').add({
      data: {
        ...userInfo,
      },
    })
      .then(res => {
        if (res && res.errMsg === 'collection.add:ok') {
          that.globalData.userInfo = {
            ...userInfo,
          };
          if (that.getUserInfoCallBack) {
            that.getUserInfoCallBack(true);
          }
        }
      });
  },

  async updateUserInfo(userInfo) {
    const that = this;
    wx.cloud.callFunction({
      name: 'updateUserInfo',
      data: {
        userInfo,
        openId: wx.appContext.OPENID,
      },
    })
      .then((res) => {
        Flimi.AppBase().logManager.log(res);
        that.globalData.userInfo = {
          ...userInfo,
        };
      })
      .catch(Flimi.AppBase().logManager.error);
  },

  isLogin() {
    const { userInfo } = this.globalData;
    if (userInfo) {
      return userInfo.nickName;
    }
    return false;
  },

  globalData: {
    userInfo: null,
  },
});
