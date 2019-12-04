import { fetchActivitiesOne, fetchArticleComment as fetchComment } from '../../../service/api';
import { getImageInfo } from '../../../service/wxpromisify';
import { formatDateChinese, formatImage } from '../../../utils/util';
import { getUserId } from '../../utils/index';
import { getFormatComment } from '../../service/comment/index';

const app = getApp();

function showLaunchingPage() {
  if (app.globalData.launchCount === 0) {
    this.setData({
      showLaunchingPage: true,
    });
    app.globalData.launchCount += 1;
  }
}

function stopLaunchingPage() {
  if (app.globalData.launchCount === 0) {
    this.setData({
      showLaunchingPage: false,
    });
  }
}

function checkLogin() {
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
}

function downloadCover() {
  const that = this;
  return Promise.resolve()
    .then(() => {
      if (!that.data.localBkImge) {
        const src = formatImage(that.data.article.cover, '/resize,w_400/quality,q_90');
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
    .then(localBkImge => that.setData({ localBkImge }));
}

function initialize(ops) {
  const that = this;
  const articleId = (() => {
    if (ops.scene) {
      return ops.scene;
    }
    if (ops.articleId) {
      return ops.articleId;
    }
    return '0';
  })();

  const { url = '', authorId, commentId } = ops;

  if (!articleId && !url) {
    wx.redirectTo({
      url: '/pages/index/index',
    });
    return;
  }

  that.setData({
    articleId,
    url,
  });

  if (authorId) {
    that.setData({
      authorId,
    });
  }

  if (commentId) {
    that.setData({
      selectedCommentId: commentId,
    });
  }

  Promise.resolve()
    .then(() => that.fetchArticle())
    .then(() => that.fetchArticleComment())
    .then(() => that.downloadCover())
    .catch((res) => {
      Flimi.AppBase().logManager.log('fetchActivitiesOne fail', res);
    });
}

function fetchArticle() {
  const that = this;
  const { articleId, url } = that.data;
  return fetchActivitiesOne({ articleId, url })
    .then((res) => {
      if (res.data.status !== 0) {
        wx.showToast({
          icon: 'none',
          title: '读取文章数据失败',
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1000);
        return;
      }
      const { data } = res.data || {};
      data.cover = (() => {
        const [cover] = data.covers || {};
        if (cover && cover.url) {
          if (cover.url.indexOf('https') >= 0) {
            return cover.url;
          }
          if (cover.url.indexOf('http') >= 0) {
            return cover.url.replace('http', 'https');
          }
        }
        return null;
      })();
      const { publishedAt, title } = data || {};
      data.time = formatDateChinese(new Date(publishedAt));
      // if (authorId && data.influencerComments.length > 0) {
      //   const influencer = data.influencerComments.find(({ authorId: id }) => id === authorId);
      //   if (influencer) {
      //     that.setData({
      //       influencer,
      //     });
      //   }
      // } else if (data.influencerComments.length > 0) {
      //   that.setData({
      //     influencer: data.influencerComments[0],
      //   });
      // }
      data.title = title.replace(/&quot;/g, '');
      that.setData({
        article: data,
        url: encodeURIComponent(data.fl_url),
        navigateTitle: data.title,
      });
      setTimeout(
        () => that.setData({
          'showMgr.page': true,
        }),
        200,
      );
      // if the launching page is showing
      // stop it at this time
      // this.stopLaunchingPage();
    })
    .catch((res) => {
      Flimi.AppBase().logManager.log('fetch article comments error: ', res);
      wx.navigateTo({
        url: '/pages/networkerror/index',
      });
    });
}

const checkInfluencerComment = (influencer, userid, text) => {
  if (influencer && userid && text) {
    const { fl_uid: uid, comment } = influencer;
    if (String(uid) === String(userid) && text === comment) {
      return true;
    }
  }
  return false;
};

function fetchArticleComment() {
  const that = this;
  const {
    influencer = null, articleId = '0', url = '',
  } = that.data;
  const userId = getUserId();
  const topComments = [];
  const vipComments = [];
  const norComments = [];
  return fetchComment({
    articleId,
    url,
    userId,
  })
    .then((res) => {
      if (res.data.status !== 0) {
        wx.showToast({
          icon: 'none',
          title: '读取评论数据失败',
        });
        return;
      }
      const {
        data: { comments },
      } = res.data;
      // eslint-disable-next-line array-callback-return
      comments.map((element) => {
        const {
          verifiedType, prime, userid,
        } = element;
        const text = element.text.replace(/[\r\n]/g, '').replace(/(^\s*)|(\s*$)/g, '');
        const isInfluencerComment = (() => {
          if (influencer) {
            influencer.comment = influencer.comment.replace(/[\r\n]/g, '').replace(/(^\s*)|(\s*$)/g, '');
            return checkInfluencerComment(influencer, userid, text);
          }
          return false;
        })();
        const result = getFormatComment(element, text);
        if (isInfluencerComment && !topComments.length) {
          topComments.push(result);
        } else if (verifiedType === 'vip' || prime) {
          vipComments.push(result);
        } else {
          norComments.push(result);
        }
        return result;
      });
      that.setData({
        oriComments: comments,
        topComments,
        vipComments,
        norComments,
      });
    })
    .catch((res) => {
      Flimi.AppBase().logManager.log('fetch article comments error: ', res);
      wx.navigateTo({
        url: '/pages/networkerror/index',
      });
    });
}

function fetchArticleRecommendComment() {
  const that = this;
  const { articleId, influencer = null } = that.data;
  const userId = getUserId();
  return fetchComment({
    articleId,
    userId,
  })
    .then((res) => {
      if (res.data.status !== 0) {
        wx.showToast({
          icon: 'none',
          title: '读取评论数据失败',
        });
        return;
      }
      const {
        data: { comments },
      } = res.data;
      // eslint-disable-next-line max-len
      const vipComments = comments.filter(element => checkInfluencerComment(influencer, element.userId, element.text));
      const primeComments = comments.filter(
        element => !checkInfluencerComment(influencer, element.userId, element.text),
      );
      that.setData({
        vipComments,
        primeComments,
      });
    })
    .catch((res) => {
      Flimi.AppBase().logManager.log('fetch article comments error: ', res);
      wx.navigateTo({
        url: '/pages/networkerror/index',
      });
    });
}

export const init = {
  initialize,

  showLaunchingPage,
  stopLaunchingPage,

  checkLogin,

  downloadCover,

  fetchArticle,
  fetchArticleComment,
  fetchArticleRecommendComment,
};

export default {};
