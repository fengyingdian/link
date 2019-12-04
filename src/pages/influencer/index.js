// pages/influencer/index.js
import { getInfluencer } from '../../service/api';
import { formatImage } from '../../utils/util';

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
    navigateBarTitle: wx.env.navigationBarTitle,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(ops) {
    const { userid, flType } = ops;
    if (!userid) {
      wx.navigateBack();
    }
    const that = this;
    getInfluencer({ userid, flType })
      .catch(() => {
        wx.navigateTo({
          url: '/pages/networkerror/index',
        });
      })
      .then((res) => {
        const { status, data: influencer } = res.data;
        if (status === 0) {
          const { avatar } = influencer;
          influencer.avatar = formatImage(avatar, '/resize,w_100/quality,q_80');
          that.setData({
            influencer,
            'showMgr.page': true,
          });
          this.setData({
            refresh: this.data.refresh + 1,
          });
        }
      });
  },

  onReachBottom() {
    this.setData({
      refresh: this.data.refresh + 1,
    });
  },

  onPageScroll(ops) {
    const { scrollTop } = ops;
    if (this.data.statusBar + 45 + 80 < scrollTop) {
      if (this.data.navigateBarTitle !== this.data.name) {
        this.setData({
          navigateBarTitle: this.data.influencer.nickname,
        });
      }
    } else if (this.data.navigateBarTitle !== wx.env.navigationBarTitle) {
      this.setData({
        navigateBarTitle: wx.env.navigationBarTitle,
      });
    }
  },
});
