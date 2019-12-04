
import { userStatusBehavior } from '../../behavior/userstatus/index';
import { getArticleComment } from '../../common/service/comment/index';

Component({
  behaviors: [userStatusBehavior],
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
    // navigate z-index fro some reasons
    // we need to set navigate bar's z-index to  0
    navigateIndexZ: 10,

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

    // more recommend
    moreRecommend: {},

    // refresh recommend article
    refreshRecommend: 0,

    // navigate bar status
    navigateStatus: 0,

    // launch comment bar status
    launchCommentStatus: 0,

    // load info
    loadingInfo: {
      // loading count
      loadingCount: 0,
      // is refresh
      isRefresh: false,
    },
  },

  methods: {
    onReady() {
      getApp().getShareCommentCallback = (opts) => {
        this.onShareComment(opts);
      };
      this.checkLogin();
    },

    checkLogin() {
      const that = this;
      that.setData({
        isLogin: getApp().isLogin(),
      });
      // waitting for callback
      getApp().getUserInfoCallBack = () => {
        that.setData({
          isLogin: getApp().isLogin(),
        });
      };
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
        .boundingClientRect((rect) => {
          const { top, bottom } = rect || {};
          if (top && bottom) {
            that.data.moreRecommend = {
              top: top + scrollTop,
              bottom: bottom + scrollTop,
            };
          }
        })
        .exec();
    },

    onShowArticleContent() {
      this.setData({
        isShowContent: true,
      });
    },

    onHideArticleContent() {
      this.setData({
        isShowContent: false,
      });
    },

    //
    // ─── REFRESH COMMENTS ────────────────────────────────────────────
    //
    onRefreshComments() {
      const that = this;
      const { article: { url = '' } = {} } = that.data;
      getArticleComment({ url })
        .then((comments) => {
          that.setData({
            comments,
          });
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
      const { comment, isTop } = opts;
      if (comment) {
        this.setData({
          selectedShareItem: {
            comment,
            isTop,
          },
        });
        if (!isTop) {
          this.drawUserCover(comment);
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
          selectedShareItem: {
            comment: {
              text: comment = '', authorDisplayName: nickname = '', desc = '', introduction = '',
            } = {},
          } = {},
          hashtag: {
            displayName: circle,
          } = {},
          statusId = '',
        } = this.data;
        this.drawPoster({
          circle,
          comment,
          nickname,
          description: introduction || desc,
          statusId,
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
    },

    loadingMoreStatus(isRefresh = false) {
      this.setData({
        loadingInfo: {
          isRefresh,
          loadingCount: this.data.loadingInfo.loadingCount + 1,
        },
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
      // Flimi.AppBase().logManager.log({ scrollTop });
      // if (scrollTop < 20 && this.data.articleContentTransform > 0) {
      //   this.setData({ articleContentTransform: 0 });
      // } else if (scrollTop > 20) {
      //   this.setData({ articleContentTransform: scrollTop / 5 });
      // }

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
      this.lastScrollTop = scrollTop;
    },

    onScrollToLower() {
      this.loadingMoreStatus(false);
    },

    //
    // ─── TOUCH ──────────────────────────────────────────────────────────────────────
    //

    onTouchStart() {
      this.touching = true;
    },

    onTouchEnd() {
      this.touching = false;
    },

    /**
     * 用户点击右上角分享
     * 用户点击分享按钮分享 res.form: button
     */
    onShareAppMessage(opts) {
      const that = this;
      const {
        imageUrl = '',
        article: { title, cover },
        statusId = '',
        selectedShareItem,
      } = that.data;
      const { target: { dataset: { type = '' } } } = opts;

      if (opts.from === 'button' && selectedShareItem && type !== 'article') {
        const { comment, isTop } = selectedShareItem;
        if (!isTop) {
          return {
            path: `/pages/userstatus/index?statusId=${statusId}`,
            title: `${comment.authorDisplayName}分享了这篇文章，围观一下？`,
            imageUrl: that.data.shareUrl,
          };
        }
        return {
          path: `/pages/userstatus/index?statusId=${statusId}`,
          title,
          imageUrl,
        };
      }
      return {
        path: `/pages/userstatus/index?statusId=${statusId}`,
        title,
        imageUrl: cover,
      };
    },
  },
});
