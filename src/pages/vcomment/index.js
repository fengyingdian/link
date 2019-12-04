// pages/vcomment/index.js
// const app = getApp();

import { init } from '../../common/js/aritcle/init';
import { draw } from '../../common/js/aritcle/draw';
// import { getWechatCode } from '../../service/userstatus';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showMgr: {
      page: false,
      poster: false,
      contact: false,
      launchComment: true,
    },

    // status bar height, for margin top
    statusBar: wx.getSystemInfoSync().statusBarHeight,

    // navigate title
    navigateTitle: '圈里圈外',

    // check if is login
    isLogin: false,

    // selected share item
    selectedShareItem: {
      comment: [],
      isTop: true,
    },

    // post height
    // it would be changed of different comment
    posterHeight: 0,

    // show launching page
    showLaunchingPage: false,

    // more recommend
    moreRecommend: {},

    // refresh recommend article
    refreshRecommend: 0,

    // navigate bar status
    navigateStatus: 0,

    // launch comment bar status
    launchCommentStatus: 0,

    // mock circle
    circle: {
      id: '5d553b4fa8dfbd0043e5384f',
      name: '红板报精选',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(ops) {
    // check if user is first launch
    // this action need to do
    // in the very first time
    // this.checkShowsLaunchingPage();

    this.onRegister();

    this.initialize(ops);

    this.checkLogin();

    getApp().getShareCommentCallback = (opts) => {
      this.onShareComment(opts);
    };
  },

  onReady() { },

  onRegister() {
    Object.keys(init).forEach((key) => {
      this[key] = init[key];
    });
    Object.keys(draw).forEach((key) => {
      this[key] = draw[key];
    });
  },

  onLaunchComment() {
    getApp().onCommentSubmitCallback = () => {
      this.fetchArticleComment();
    };
    this.fetchArticleComment();
  },

  getMoreRecommendInfo(scrollTop) {
    const that = this;
    return wx.createSelectorQuery()
      .select('.more-recommend')
      .boundingClientRect((res) => {
        if (res && res.top && res.bottom) {
          const { top, bottom } = res;
          Flimi.AppBase().logManager.log('.more-recommend', top, bottom, scrollTop);
          if (top && bottom) {
            that.data.moreRecommend = {
              top: top + scrollTop,
              bottom: bottom + scrollTop,
            };
          }
        }
      })
      .exec();
  },

  //
  // ─── SHARE COMMENT ───────────────────────────────────────────────
  //

  onShareComment(opts) {
    this.setData({
      posterHeight: 0,
      posterUrl: '',
      isShowShareComment: true,
    });
    const { comment, isTop } = opts;
    if (comment) {
      this.setData({
        selectedShareItem: {
          comment,
          isTop,
        },
        posterHeight: 0,
        posterUrl: '',
        isShowShareComment: true,
      });
      if (!isTop) {
        this.drawUserCover();
      }
    } else {
      this.setData({
        selectedShareItem: null,
      });
    }
  },

  onCloseShareComment() {
    this.setData({
      isShowShareComment: false,
    });
    wx.hideLoading();
  },

  //
  // ─── POSTER VIEW ──────────────────────────────────────────────────
  //

  onShowPosterView() {
    if (this.data.selectedShareItem) {
      wx.showLoading({
        title: '生成图片中',
      });

      const {
        comment: {
          text: comment, authorDisplayName: nickname, desc, introduction,
        },
      } = this.data.selectedShareItem;

      this.drawPoster({
        comment,
        nickname,
        description: introduction || desc,
      });
    } else {
      const {
        text: comment, authorDisplayName: nickname, desc, introduction,
      } = this.data.topComments[0];

      this.drawPoster({
        comment,
        nickname,
        description: introduction || desc,
      });
    }
  },

  onClosePosterView() {
    this.setData({
      isShowPosterView: false,
    });
    wx.hideLoading();
  },

  //
  // ─── LOAD MORE COMMENT ──────────────────────────────────────────────────────────
  //

  onLoadMoreComment() {
    this.setData({
      moreRecommend: {},
    });
  },

  onUnload() { },

  onReachBottom() {
    this.setData({
      refreshRecommend: this.data.refreshRecommend + 1,
    });
  },

  onPageScroll({ scrollTop }) {
    const {
      moreRecommend,
      statusBar,
      navigateTitle,
      article,
      circle,
    } = this.data;

    this.getMoreRecommendInfo(scrollTop);

    const trigger = scrollTop + statusBar + 45;
    const middleUpper = 0.5 * (100 + 16);

    if (moreRecommend.top + middleUpper < trigger && navigateTitle !== circle.name) {
      this.setData({
        launchCommentStatus: 1,
        navigateTitle: circle.name,
      });
    }
    if (moreRecommend.top > trigger && navigateTitle !== article.title) {
      this.setData({
        launchCommentStatus: 0,
        navigateTitle: article.title,
      });
    }
  },

  /**
   * 用户点击右上角分享
   * 用户点击分享按钮分享 res.form: button
   */
  onShareAppMessage(opts) {
    const that = this;
    const {
      imageUrl,
      article: { fl_url: url, title, cover },
    } = that.data;

    if (opts.from === 'button' && that.data.selectedShareItem) {
      const { comment, isTop } = that.data.selectedShareItem;
      if (!isTop) {
        return {
          path: `/pages/vcomment/index?url=${encodeURIComponent(url)}`,
          title: `${comment.authorDisplayName}分享了这篇文章，围观一下？`,
          imageUrl: that.data.shareUrl,
        };
      }
      return {
        path: `/pages/vcomment/index?url=${encodeURIComponent(url)}`,
        title,
        imageUrl,
      };
    }

    return {
      path: `/pages/vcomment/index?url=${encodeURIComponent(url)}`,
      title,
      imageUrl: cover,
    };
  },
});
