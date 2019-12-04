// pages/circle/index.js
import { getCirleById } from '../../service/api';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusBar: wx.getSystemInfoSync().statusBarHeight,
    indicatorDots: false,
    vertical: false,
    autoplay: false,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    hideTimeStamp: null,
    titleSelected: 0,
    refresh: 0,
    showMgr: {
      page: false,
    },
    total: 100,
    navigateBarTitle: wx.env.navigationBarTitle,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(ops) {
    const { id, name } = ops;
    if (!id) {
      wx.navigateBack();
    }
    this.setData({
      circleId: id,
      name,
    });

    getCirleById(id)
      .catch(() => {
        wx.navigateTo({
          url: '/pages/networkerror/index',
        });
      })
      .then((res) => {
        const {
          circle: { description },
          influencers,
        } = res.data.data;
        this.setData({
          description,
          influencers,
          'showMgr.page': true,
        });
      });
  },

  onReachBottom() {
    this.setData({
      refresh: this.data.refresh + 1,
    });
  },

  onPageScroll(ops) {
    const { scrollTop } = ops;
    if (this.data.statusBar + 45 < scrollTop) {
      if (this.data.navigateBarTitle !== this.data.name) {
        this.setData({
          navigateBarTitle: this.data.name,
        });
      }
    } else if (this.data.navigateBarTitle !== wx.env.navigationBarTitle) {
      this.setData({
        navigateBarTitle: wx.env.navigationBarTitle,
      });
    }
  },
});
