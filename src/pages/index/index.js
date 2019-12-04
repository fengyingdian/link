/*
 * File: index.js
 * Project: flimi
 * File Created: Saturday, 20th April 2019 10:34:22 pm
 * Author: break (fengyingdian@126.com)
 */

Component({
  properties: {

  },

  data: {
    // loading page
    loadingPageStatus: 1,

    // margin
    marginTop: wx.getSystemInfoSync().statusBarHeight + 45,

    // load info
    loadingInfo: {
      // loading count
      loadingCount: 0,
      // is refresh
      isRefresh: false,
    },

    // loadding 1.5 articles?
    isLoadingArticles: false,
  },

  methods: {
    onReady() {
      const that = this;
      setTimeout(() => {
        that.setData({
          loadingPageStatus: 0,
        });
      }, 300);
    },

    onPullDownRefresh() {
      setTimeout(() => {
        wx.stopPullDownRefresh();
      }, 300);
      this.loadingMoreStatus(true);
    },

    onReachBottom() {
      this.loadingMoreStatus(false);
    },

    loadingMoreStatus(isRefresh = false) {
      this.setData({
        loadingInfo: {
          isRefresh,
          loadingCount: this.data.loadingInfo.loadingCount + 1,
        },
      });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {},
  },

});
