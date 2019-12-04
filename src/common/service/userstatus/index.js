import { fetchHotStatuses, fetchHashtagStatuses, getUserStatus as getUserStatusRaw } from '../../../service/userstatus';
import { FetchHotStatusError, FetchHashtagStatusError, FetchUserStatusError } from '../../error/index';
import { formatTime, formatDate } from '../../../utils/util';

const dealWithFeedUserStatusResult = (res) => (error) => {
  if (!res || !res.data || res.data.status !== 0) {
    wx.showToast({
      icon: 'none',
      title: '获取动态流失败',
    });
    return error;
  }
  const {
    data: {
      items = [],
      board = {},
    } = {},
    meta: {
      pageKey: newKey = '',
    } = {},
  } = res.data || {};
  const hotStatuses = items.map((item) => {
    const {
      displayText = '',
      postedAt = '',
      user = {},
      hashtags: [hashtag = {}] = [],
      previews = [],
      id = '',
    } = item || {};
    const [article = {}] = previews.filter((preview) => preview.type && preview.type === 'article') || [];
    return {
      comment: {
        ...user,
        content: displayText,
        postTime: formatTime(new Date(postedAt)),
      },
      article: {
        ...article,
        ...article.flMetadata,
        publishedTime: formatDate(new Date(article.publishedAt)),
      },
      hashtag,
      id,
    };
  });
  return {
    board,
    hotStatuses,
    newKey,
  };
};

const dealWithUserStatusResult = (res) => {
  if (!res || !res.data || res.data.status !== 0) {
    wx.showToast({
      icon: 'none',
      title: '获取动态流失败',
    });
    return FetchUserStatusError;
  }
  const {
    data: {
      userStatus: {
        displayText = '',
        postedAt = '',
        hashtags: [hashtag = {}] = [],
        previews = [],
        id = '',
      },
      user,
    } = {},
  } = res.data || {};
  const [article = {}] = previews.filter((preview) => preview.type && preview.type === 'article') || [];
  return {
    comment: {
      ...user,
      content: displayText,
      postTime: formatTime(new Date(postedAt)),
    },
    article: {
      ...article,
      ...article.flMetadata,
      publishedTime: formatDate(new Date(article.publishedAt)),
    },
    hashtag,
    id,
  };
};

export const getHotStatuses = ({ userid = 0, pageKey = '', perPage = 10 }) => fetchHotStatuses({ userid, pageKey, perPage })
  .then((res) => dealWithFeedUserStatusResult(res)(FetchHotStatusError))
  .catch((res) => {
    Flimi.AppBase().logManager.log('fetch hot status error: ', res);
    wx.navigateTo({
      url: '/pages/networkerror/index',
    });
  });

export const getHashtagStatuses = ({ hashtagId = 0, pageKey = '', perPage = 10 }) => fetchHashtagStatuses({ hashtagId, pageKey, perPage })
  .then((res) => dealWithFeedUserStatusResult(res)(FetchHashtagStatusError))
  .catch((res) => {
    Flimi.AppBase().logManager.log('fetch hash tag status error: ', res);
    wx.navigateTo({
      url: '/pages/networkerror/index',
    });
  });

export const getUserStatus = (statusId = 0) => getUserStatusRaw(statusId)
  .then((res) => dealWithUserStatusResult(res))
  .catch((res) => {
    Flimi.AppBase().logManager.log('get user status error: ', res);
    wx.navigateTo({
      url: '/pages/networkerror/index',
    });
  });

export default {};
