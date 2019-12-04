import { getHashtagStatuses } from '../../../common/service/userstatus/index';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hashtag: {
      type: Object,
      value: {},
      observer(newValue) {
        if (newValue) {
          this.loadingMore(newValue);
        }
      },
    },
    loadingInfo: {
      type: Object,
      value: {
        loadingCount: 0,
        isRefresh: false,
      },
      observer(newValue) {
        if (newValue) {
          this.loadingMore(newValue);
        }
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    userStatuses: [],
    hasMoreUserStatus: true,
    pageKey: '',
    perPage: 6,
  },

  attached() { },

  ready() { },

  /**
   * 组件的方法列表
   */
  methods: {
    getFetchData(isRefresh = false) {
      const { pageKey, perPage, userStatuses } = this.data;
      return {
        formerStatuses: isRefresh ? [] : userStatuses,
        formerKey: isRefresh ? [] : pageKey,
        perPage,
      };
    },

    IsGoingToRefresh(userStatuses, hotStatuses) {
      if (userStatuses && hotStatuses) {
        const [hotStatus = {}] = hotStatuses;
        const [firstItem = []] = userStatuses;
        const [firstStatus = {}] = firstItem;
        const { article: { itemId: firstStatusItemId = '' } = {} } = firstStatus;
        const { hotStatus: { itemId: hotStatusItemId = '' } = {} } = hotStatus;
        if (firstStatusItemId === hotStatusItemId) {
          return false;
        }
      }
      return true;
    },

    loadingMore(loadingInfo) {
      const { isRefresh = false } = loadingInfo || {};
      const { hashtag: { hashtagId = '' } = {} } = this.data;
      if (hashtagId) {
        this.fetchActivities(isRefresh, hashtagId);
      }
    },

    fetchActivities(isRefresh = false, hashtagId) {
      const that = this;
      const { hasMoreUserStatus, userStatuses } = that.data;
      const { formerStatuses, formerKey, perPage } = this.getFetchData(isRefresh);
      if (isRefresh || (!isRefresh && hasMoreUserStatus)) {
        getHashtagStatuses({ hashtagId, pageKey: formerKey, perPage })
          .then(({ hotStatuses = [], newKey = '' }) => {
            if (isRefresh && !this.IsGoingToRefresh(userStatuses, hotStatuses)) {
              return;
            }
            that.setData({
              hasMoreUserStatus: hotStatuses.length >= perPage,
              userStatuses: [...formerStatuses, hotStatuses],
            });
            that.data.pageKey = newKey;
          })
          .catch(() => {
            wx.navigateTo({
              url: '/pages/networkerror/index',
            });
          });
      }
    },
  },
});
