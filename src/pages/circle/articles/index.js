// pages/index/index.js
import { fetchCircleSmart } from '../../../service/api';
import { formatTime, formatImage } from '../../../utils/util';

Component({
  properties: {
    article: {
      type: Object,
      value: null,
    },
    circleId: {
      type: String,
      value: '',
    },
    name: {
      type: String,
      value: '',
    },
    refresh: {
      type: Number,
      value: 0,
      observer(newValue) {
        if (!this.data.fetchedAll && newValue) {
          this.fetchActivities();
        }
      },
    },
  },

  data: {
    page: 1,
    pageSize: 6,
    pageKey: '',
    articles: [],
    bottomTips: '- END -',
    fetchedAll: false,
  },

  lifetimes: {
    attached() {},
    moved() {},
    detached() {},
  },

  attached() {},
  ready() {},

  pageLifetimes: {
    show() {
      this.fetchActivities();
    },
    hide() {},
    resize() {},
  },

  methods: {
    fetchActivities() {
      const that = this;
      const {
        circleId, page, pageKey, pageSize,
      } = that.data;
      fetchCircleSmart({ id: circleId, pageKey, pageSize })
        .catch(() => {
          wx.navigateTo({
            url: '/pages/networkerror/index',
          });
        })
        .then((res) => {
          const {
            data,
            meta: { pageKey: newPageKey },
            status,
          } = res.data;
          if (status !== 0) {
            return;
          }
          data.map((element) => {
            const {
              influencerComments,
              authorId,
              covers: [cover],
            } = element;
            const result = element;
            const influencer = influencerComments.find(({ authorId: id }) => id === authorId);
            if (influencer) {
              result.influencer = influencer;
              const { fullSlug, comment, avatar } = influencer;
              result.commentTime = formatTime(new Date(parseInt(fullSlug.slice(0, 10), 10) * 1000));
              influencer.avatar = formatImage(avatar, '/resize,w_100/quality,q_80');
              influencer.comment = comment.replace(/[\r\n]/g, '').replace(/(^\s*)|(\s*$)/g, '');
            }
            // cover
            result.coverSrc = (() => {
              if (cover) {
                return cover.url;
              }
              // TODO
              // need a default cover image
              return '';
            })();
            return result;
          });

          if (data.length < pageSize) {
            that.setData({
              fetchedAll: true,
              [`articles[${page - 1}]`]: data,
            });
          } else {
            that.setData({
              page: page + 1,
              [`articles[${page - 1}]`]: data,
            });
          }
          that.data.pageKey = newPageKey;
        });
    },

    tapArticle() {},
  },
});
