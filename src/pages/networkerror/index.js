// pages/networkerror/index.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    content: '网络错误或服务端错误，请尝试重新加载页面',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  onShow() {
    const timestamp = new Date().getTime();
    const { hideTimeStamp } = this.data;
    if (hideTimeStamp && timestamp - hideTimeStamp > 1000 * 60 * 1) {
      wx.reLaunch({
        url: '/pages/index/index',
      });
    }
  },

  onHide() {
    this.setData({
      hideTimeStamp: new Date().getTime(),
    });
  },

  tapRetry() {
    wx.reLaunch({
      url: '/pages/index/index',
    });
  },
});
