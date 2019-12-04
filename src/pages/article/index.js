// pages/vcomment/index.js
// const app = getApp();

import { init } from '../../common/js/aritcle/init';
import { draw } from '../../common/js/aritcle/draw';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showMgr: {
      page: false,
      poster: false,
      contact: false,
      comment: false,
      launchComment: true,
    },

    // status bar height, for margin top
    statusBar: wx.getSystemInfoSync().statusBarHeight + 45,

    // screen height
    screenHeight: wx.getSystemInfoSync().screenHeight,

    // comment handlder height
    commentHandlerHeight: 62, // 62 90

    // article content z-index
    contentZ: 20,

    // article comment z-index
    commentZ: 10,

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

    // top title
    topTitle: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(ops) {
    this.onRegister();

    this.initialize(ops);

    this.checkLogin();
  },

  onReady() {
    this.setData({
      commentHandlerHeight: wx.isIphoneX() ? 90 : 62,
    });
  },

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

  // getArticleContentEndInfo(scrollTop) {
  //   wx.createSelectorQuery()
  //     .select('.article-content-end')
  //     // eslint-disable-next-line consistent-return
  //     .boundingClientRect(({ top, bottom }) => {
  //       // Flimi.AppBase().logManager.log('.article-content-end', top, bottom);
  //       if (top && bottom) {
  //         return {
  //           top: top + scrollTop,
  //           // bottom: bottom + scrollTop,
  //         };
  //       }
  //       return {};
  //     })
  //     .exec();
  // },

  //
  // ─── CLAP COMMENT ────────────────────────────────────────────────
  //
  onClapComment() {
    this.fetchArticleComment();
  },

  //
  // ─── RESPOND COMMENT ─────────────────────────────────────────────
  //
  onRespondComment(ops) {
    this.setData({
      repondFocus: true,
      respondComment: ops.detail,
      isShowRespondComment: true,
    });
  },

  onRespondCommentSubmit(ops) {
    const { refresh } = ops.detail;
    if (refresh) {
      this.fetchArticleComment();
    }
    this.onCloseRespondComment();
  },

  onCloseRespondComment() {
    this.setData({
      respondFocus: false,
      isShowRespondComment: false,
    });
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
    if (opts.detail) {
      const { comment, isTop } = opts.detail;
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

  onChangeCommentStatus() {
    const {
      screenHeight, statusBar, commentHandlerHeight, scrollTopComment,
    } = this.data;
    const commentHeight = screenHeight - statusBar - commentHandlerHeight;
    if (scrollTopComment !== commentHeight) {
      this.setData({
        contentZ: 1,
        scrollTopComment: commentHeight,
      });
    } else {
      this.onShowContent();
    }
  },

  onUnload() { },

  onReachBottom() { },

  //
  // ─── CONTENT SCROLL ─────────────────────────────────────────────────────────────
  //
  onScrollContent(e) {
    // Flimi.AppBase().logManager.log('scroll content: ', e);
    const { scrollTop } = e.detail;
    const topTitle = '红板报';
    if (scrollTop > 100 && this.data.topTitle !== topTitle) {
      this.setData({
        topTitle,
      });
    } else if (scrollTop < 100 && this.data.topTitle === topTitle) {
      this.setData({
        topTitle: '',
      });
    }
  },

  //
  // ─── COMMENT SCROLL ───────────────────────────────────────────
  //
  onScrollComment(e) {
    // Flimi.AppBase().logManager.log('scroll comment: ', e);

    const that = this;
    that.scrollTop = e.detail.scrollTop;
    if (that.data.contentZ === 20 && !that.fallbackScroll) {
      that.setData({
        contentZ: 1,
      });
    }
    that.onScrollCommentEnd();
    that.scrollEndTimer = setTimeout(() => {
      that.onScrollCommentEnd();
    }, 100);
  },

  onScrollCommentEnd() {
    if (this.scrollEndTimer) {
      clearTimeout(this.scrollEndTimer);
      this.scrollEndTimer = null;
    }
  },

  //
  // ─── COMMENT TOUCH ──────────────────────────────────────────────────────────────
  //
  onTouchCommentStart(opts) {
    // Flimi.AppBase().logManager.log('touch start', opts.touches[0].pageY);
    this.touching = true;
    this.fallbackScroll = false;
    this.lastY = opts.touches[0].pageY;
    if (this.data.contentZ === 20) {
      this.setData({
        contentZ: 1,
      });
    }
  },

  onTouchCommentEnd(opts) {
    // Flimi.AppBase().logManager.log('touch end', this.lastY, opts.changedTouches[0].pageY);
    this.touching = false;
    const {
      screenHeight, statusBar, commentHandlerHeight,
    } = this.data;
    // touch end before scroll
    if (this.scrollEndTimer) {
      clearTimeout(this.scrollEndTimer);
      this.scrollEndTimer = null;
      // uppper
      if (this.lastY > opts.changedTouches[0].pageY) {
        this.setData({
          scrollTopComment: screenHeight - statusBar - commentHandlerHeight,
        });
      // lower
      } else {
        this.onShowContent();
      }
    // touch end after scroll
    } else if (this.scrollTop > 0.5 * (screenHeight - statusBar)) {
      this.setData({
        scrollTopComment: screenHeight - statusBar - commentHandlerHeight,
      });
    } else {
      this.onShowContent();
    }
  },

  onShowContent() {
    const that = this;
    that.setData({
      scrollTopComment: 0,
    });
    that.fallbackScroll = true;
    setTimeout(() => {
      if (this.data.contentZ === 1) {
        this.setData({
          contentZ: 20,
        });
      }
    }, 300);
  },

  //
  // ─── SHARE APP ──────────────────────────────────────────────────────────────────
  //
  onShareAppMessage(opts) {
    const that = this;
    const {
      imageUrl,
      authorId,
      article: { id: articleId, title, cover },
    } = that.data;

    if (opts.from === 'button' && that.data.selectedShareItem) {
      const { comment, isTop } = that.data.selectedShareItem;
      if (!isTop) {
        return {
          path: `/pages/vcomment/index?articleId=${articleId}&author=${authorId}`,
          title: `${comment.authorDisplayName}分享了这篇文章，围观一下？`,
          imageUrl: that.data.shareUrl,
        };
      }
      return {
        path: `/pages/vcomment/index?articleId=${articleId}&author=${authorId}`,
        title,
        imageUrl,
      };
    }

    return {
      path: `/pages/vcomment/index?articleId=${articleId}&author=${authorId}`,
      title,
      imageUrl: cover,
    };
  },
});
