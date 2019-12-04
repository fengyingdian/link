// pages/profile/index.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    navigateBarTitle: '个人中心',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    if (app.globalData.userInfo) {
      const { nickname, avatar, fl_uid: userid } = app.globalData.userInfo;
      this.setData({
        logined: true,
        nickname,
        avatar,
        userid,
      });
    } else {
      this.setData({
        logined: false,
        nickname: '',
        avatar: 'http://sapp.flipboard.cn/static/assets/ios-user-2.png',
      });
    }
  },

  onGotAuthorization(options) {
    const that = this;
    getApp()
      .onGotAuthorization({
        encryptedData: options.detail.encryptedData,
        iv: options.detail.iv,
      })
      .then((res) => {
        if (res) {
          const {
            nickname,
            avatar = 'http://sapp.flipboard.cn/static/assets/ios-user-2.png',
          } = getApp().globalData.userInfo;
          that.setData({
            nickname,
            avatar,
          });
          wx.showToast({
            title: '刷新成功',
          });
        } else {
          wx.showToast({
            title: '刷新失败',
          });
        }
      });
  },
});
