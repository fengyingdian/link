// pages/webview/index.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showPage: false,
    statusBar: wx.getSystemInfoSync().statusBarHeight,
    origin: [1, 2, 3],
    numbers: [1, 2, 3],
    scrollInit: 400,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(ops) {
    const { articleId, authorId, imageUrl } = ops;
    const that = this;
    that.setData({
      articleId,
      authorId,
      imageUrl,
    });
    if (app.globalData.userInfo) {
      const { avatar } = app.globalData.userInfo;
      that.setData({
        avatar: encodeURIComponent(avatar),
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    // Flimi.AppBase().logManager.log('onHide');
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    if (app.getUnloadWebViewCallback) {
      // Flimi.AppBase().logManager.log('send');
      app.getUnloadWebViewCallback();
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() { },

  onScroll(e) {
    const that = this;
    that.onScrollEnd();
    const { numbers } = that.data;
    const { scrollTop } = e.detail || {};
    Flimi.AppBase().logManager.info({ scrollTop });
    const countExpected = parseInt(scrollTop / 400, 10);
    const index = countExpected % 3;
    if (index === 0) {
      const item = numbers[index];
      const numberExpected = (item - 1) % 3 === 0 ? 3 : (item - 1) % 3;
      this.setData({
        scrollInit: 400 + scrollTop,
        numbers: [numberExpected].concat(numbers),
      });
    }
  },

  onScrollEnd() {
    if (this.scrollEndTimer) {
      clearTimeout(this.scrollEndTimer);
      this.scrollEndTimer = null;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    const {
      imageUrl, coverUrl, title, authorId, articleId,
    } = this.data;
    if (imageUrl) {
      return {
        title,
        imageUrl: decodeURIComponent(imageUrl),
        path: `/pages/vcomment/index?articleId=${articleId}&author=${authorId}`,
      };
    }
    return {
      title,
      imageUrl: coverUrl,
      path: `/pages/vcomment/index?articleId=${articleId}&author=${authorId}`,
    };
  },
});
