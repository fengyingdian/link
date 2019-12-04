import { version, HOST, wxRequestWithAuthorization } from './api';

/*
* fetch host statuses
*/
export const fetchHotStatuses = ({ userid = 0, pageKey = '', perPage = 10 }) => wxRequestWithAuthorization({
  url: `${HOST}/api/app/activities/feed/hotstatuses/${userid}`,
  data: {
    pageKey,
    limit: perPage,
    version,
  },
});

/*
* fetch hashtag statuses
*/
export const fetchHashtagStatuses = ({ hashtagId = 0, pageKey = '', perPage = 10 }) => wxRequestWithAuthorization({
  url: `${HOST}/api/app/activities/feed/hashtags/${hashtagId}`,
  data: {
    pageKey,
    limit: perPage,
  },
});

export const getUserStatus = (statusId) => wxRequestWithAuthorization({
  url: `${HOST}/api/app/userstatuses/${statusId}`,
});

export const getWechatCode = (statusId) => wxRequestWithAuthorization({
  url: `${HOST}/api/app/userstatuses/actions/get-wxcode`,
  data: {
    statusId,
  },
});

export default {};
