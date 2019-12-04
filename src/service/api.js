/*
 * File: api.js
 * File Created: Friday, 12th April 2019 3:50:06 pm
 * Author: Break <fengyingdian@126.com>
 */

export const version = '0.2.4';

export const platform = 'p';

export const HOST = (() => {
  if (platform === 's') {
    return 'https://influencer-service-staging.flipchina.cn';
  }
  if (platform === 'p') {
    return 'https://influencer-service.flipchina.cn';
  }
  return 'http://localhost:8800';
})();

// eslint-disable-next-line max-len
export const wxPromisify = (wxCPSFunction) => (opts) => new Promise((resolve, reject) => wxCPSFunction({
  ...opts,
  success: (result) => {
    resolve(result);
  },
  fail: (reason) => {
    reject(reason);
  },
}));

export const wxRequest = ({ url, method = 'GET', data = {} }) => {
  Flimi.AppBase().logManager.log(method, url, data);
  return wxPromisify(wx.request)({
    url,
    method,
    data,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export const wxRequestWithAuthorization = ({ url, method = 'GET', data = {} }) => {
  Flimi.AppBase().logManager.log(method, url, data);
  const token = (() => {
    const { userInfo } = getApp().globalData;
    if (userInfo) {
      return userInfo.token || '';
    }
    return '';
  })();
  return wxPromisify(wx.request)({
    url,
    method,
    data,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // eslint-disable-next-line
      'Authorization': `Bearer ${token}`,
    },
  });
};

/**
 * get status
 */
export const getStatus = () => wxRequest({
  url: `${HOST}/api/status`,
});

/**
 * get sessionKey
 */
export const getSessionKey = code => wxRequest({
  url: `${HOST}/auth/wx/sessionkey`,
  data: {
    code,
  },
  method: 'POST',
});

/**
 * is logined
 */
export const isLogin = code => wxRequest({
  url: `${HOST}/auth/wx/islogin`,
  data: {
    code,
  },
  method: 'POST',
});

/**
 * login
 */
export const login = ({ code, encryptedData, iv }) => wxRequest({
  url: `${HOST}/auth/wx/login`,
  data: {
    code,
    encryptedData,
    iv,
  },
  method: 'POST',
});

/**
 * home feed
 */
export const fetchActivitiesSmart = ({ pageKey, perPage }) => wxRequestWithAuthorization({
  url: `${HOST}/api/app/activities/feed/home`,
  data: {
    page_key: pageKey,
    per_page: perPage,
    version,
  },
});

/**
 * cirle feed
 */
export const fetchCircleSmart = ({ id, pageKey, pageSize }) => wxRequestWithAuthorization({
  url: `${HOST}/api/app/activities/feed/circle`,
  data: {
    page_key: pageKey,
    per_page: pageSize,
    circleId: id,
    version,
  },
});

/**
 * influencer feed
 */
export const fetchInfluencerSmart = ({ userid, page, pageSize }) => wxRequestWithAuthorization({
  url: `${HOST}/api/app/activities/feed/influencer/${userid}`,
  data: {
    page,
    per_page: pageSize,
    version,
  },
});

/**
 * article basic info
 */
export const fetchActivitiesOne = ({ articleId = '0', url }) => wxRequestWithAuthorization({
  url: `${HOST}/api/app/articles/${articleId}?url=${url}`,
});

/**
 * article content
 */
export const fetchFormattedArticle = ({ articleId = '0', url, isParseHtml }) => wxRequestWithAuthorization({
  url: `${HOST}/api/app/articles/${articleId}/content?url=${url}`,
  data: {
    isParseHtml,
  },
});

/**
 * article's all comments
 */
export const fetchArticleComment = ({ articleId = '0', url, userId }) => wxRequestWithAuthorization({
  url: `${HOST}/api/app/articles/${articleId}/comments?url=${url}`,
  data: {
    userId,
  },
});

/**
 * today's recommend
 */
export const fetchRecommendsToday = () => wxRequestWithAuthorization({
  url: `${HOST}/api/app/articles/recommends/today`,
});

/**
 * add comment
 * new version
 */
export const addFlipBoardComment = ({
  articleId = '0', url, uid, comment, toUid, replyId, rootId,
}) => wxRequestWithAuthorization({
  url: `${HOST}/api/app/article/actions/comment?url=${url}`,
  method: 'POST',
  data: {
    articleId,
    uid,
    toUid,
    replyId,
    rootId,
    comment,
  },
});

/**
 * like to comment
 */
export const addCommentLike = ({
  userId, articleId = '0', url, commentId, like, replyId, rootId,
}) => wxRequestWithAuthorization({
  url: `${HOST}/api/app/comment/actions/like-comment?url=${url}`,
  method: 'POST',
  data: {
    userId,
    articleId,
    commentId,
    replyId,
    rootId,
    like,
  },
});

/**
 * get influencer info
 */
export const getInfluencer = ({ userId, flType }) => {
  // Flimi.AppBase().logManager.log(`getInfluencer:${userId}`);
  if (flType) {
    return wxRequestWithAuthorization({
      url: `${HOST}/api/app/influencers/0?`,
      data: {
        fl_uid: userId,
      },
    });
  }
  return wxRequestWithAuthorization({
    url: `${HOST}/api/app/influencers/${userId}`,
  });
};

/**
 * get circle info by name
 */
export const getCirleByName = name => wxRequestWithAuthorization({
  url: `${HOST}/api/app/circle/0`,
  data: {
    name,
  },
});

/**
 * get circle info by id
 */
export const getCirleById = id => wxRequestWithAuthorization({
  url: `${HOST}/api/app/circle/${id}`,
});

// exports.module = {
//   wxPromisify,
//   wxRequest,
// };

export default {};
