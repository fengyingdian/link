// pages/launchComment/index.js
import { fetchActivitiesOne, addFlipBoardComment } from '../../service/api';
import { getImageInfo, canvasToTempFilePath } from '../../service/wxpromisify';
import { getPosterHeight, drawSharePoster } from '../../common/js/aritcle/canvas';
import { formatImage, toHttps } from '../../utils/util';

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusBar: wx.getSystemInfoSync().statusBarHeight,
    content: '',
    placeholder: '说出你的观点...',
    isDisableSubmit: false,
    showPage: true,
    showPoster: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(ops) {
    const {
      url,
      title,
      respondTo = '',
      toUid = '',
      replyId = '',
      rootId = '',
      statusId = '',
      articleId = '', // 兼容旧版本
    } = ops;
    const that = this;
    that.setData({
      statusId,
      articleId,
      url,
      title,
      respondTo,
      toUid,
      replyId,
      rootId,
      avatar: getApp().globalData.userInfo.avatar,
      nickname: getApp().globalData.userInfo.nickname,
    });

    if (respondTo.length > 0) {
      that.setData({
        placeholder: `回复 ${respondTo}: `,
      });
    }

    fetchActivitiesOne({ url })
      .then((res) => {
        if (res.data.status === 0) {
          that.setData({
            article: res.data.data,
          });
        }
      })
      .catch();
  },

  onShow() {},

  onUserInput(e) {
    const { value: content = '' } = e.detail;
    this.setData({
      content,
    });
  },

  onSubmit() {
    if (!this.checkContentEmpty()) {
      return;
    }
    this.submit(this.data.content);
  },

  submit(content) {
    const that = this;
    const {
      userInfo: { fl_uid: uid },
    } = app.globalData;
    if (uid) {
      const {
        url, toUid, replyId, rootId,
      } = that.data;
      that.setData({
        isDisableSubmit: true,
      });
      addFlipBoardComment({
        url,
        uid,
        comment: content,
        toUid,
        replyId,
        rootId,
      })
        .then((res) => {
          // Flimi.AppBase().logManager.log('submit.success', res);
          const { status } = res.data;
          if (status === 0) {
            wx.showLoading({
              title: '观点发表中...',
              duration: 1500,
            });
            that.onAfterSumbmit(content);
          } else {
            wx.showToast({
              title: '发布失败',
              duration: 1500,
            });
          }
        })
        .catch(() => {
          // Flimi.AppBase().logManager.log('submit.fail', res);
          wx.showToast({
            title: '发布失败',
            duration: 1500,
          });
        })
        .then(() => that.setData({
          isDisableSubmit: false,
        }));
    } else {
      wx.showToast({
        title: '尚未登录',
      });
      wx.navigateBack();
    }
  },

  onAfterSumbmit(content) {
    const posterHeight = getPosterHeight({
      comment: content,
      ctx: wx.createCanvasContext('getPosterHeight'),
    });

    this.setData({
      posterHeight,
    });

    const { nickname, description = '' } = getApp().globalData.userInfo;
    this.drawPoster({
      comment: content,
      nickname,
      description,
    });
  },

  onClosePosterView() {
    const pages = getCurrentPages();
    // I am sure the pages's
    // length must be bigger than 1

    const prePage = pages[pages.length - 2];
    if (prePage.route === 'pages/webview/index' && pages.length > 2) {
      wx.navigateBack({ delta: 2 });
    } else {
      wx.navigateBack();
    }
  },

  checkContentEmpty() {
    const that = this;
    const content = that.data.content.replace(/(^\s*)|(\s*$)/g, '');
    if (content.length < 1) {
      wx.showToast({
        title: '内容为空',
        icon: 'fail',
        duration: 1500,
      });
      return false;
    }
    return true;
  },

  drawPoster({ comment, nickname, description }) {
    const that = this;
    Promise.resolve()
      .then(() => {
        if (!that.data.localBkImge) {
          const src = formatImage(
            toHttps(that.data.article.covers[0].url),
            '/resize,w_400/quality,q_90',
          );
          return getImageInfo({ src });
        }
        return that.data.localBkImge;
      })
      .catch((res) => {
        Flimi.AppBase().logManager.log('download bkImage fail', res);
        return {
          path: '/assets/temp/bg.jpg',
          widhth: 1200,
          height: 800,
        };
      })
      .then((localBkImge) => {
        that.setData({ localBkImge });
      })
      .then(() => {
        if (!that.data.localQRcodePath) {
          const path = (() => {
            const { articleId = '', statusId = '' } = that.data;
            if (statusId) {
              return `https://s.flipboard.cn/influencer/wxcode/articles/${this.statusId}`;
            }
            if (articleId) {
              return `https://s.flipboard.cn/influencer/wxcode/articles/${this.statusId}`;
            }
            return '';
          })();
          return getImageInfo({
            src: path,
          });
        }
        return {
          path: that.data.localQRcodePath,
        };
      })
      .catch((res) => {
        Flimi.AppBase().logManager.log('download qrcode fail', res);
        return {
          path: '/assets/temp/QRCode.jpg',
        };
      })
      .then(({ path }) => {
        that.data.localQRcodePath = path;
      })
      .then(() => {
        drawSharePoster({
          nickname,
          comment,
          description,
          canvasHeight: that.data.posterHeight,
          ctx: wx.createCanvasContext('poster'),
          title: that.data.article.title,
          // for back ground image
          // we need it's path/width/height
          // to fit it's size to escape shrink
          bkImage: that.data.localBkImge,
          // for qrcode because it's size
          // is constant and squared
          // we just need it's path
          qrcode: that.data.localQRcodePath,
        });
      })
      .then(() => setTimeout(
        () => canvasToTempFilePath({ canvasId: 'poster', fileType: 'jpg' })
          .then(({ tempFilePath }) => that.setData({
            posterUrl: tempFilePath,
            showPage: false,
            showPoster: 'showPopup',
          }))
          .then(() => wx.hideToast())
          .then(() => {
            if (app.onCommentSubmitCallback) {
              app.onCommentSubmitCallback();
            }
          }),
        100,
      ))
      .catch(res => Flimi.AppBase().logManager.log('draw poster fail', res));
  },

  onUnload() {},
});
