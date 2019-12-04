// pages/index/index.js
import { fetchCircleSmart } from '../../../service/api';
import { formatImage } from '../../../utils/util';

// recommend data
// if circleId changed pageKey
// need to be reset to ''
const recommend = {
  pageKey: '',
  circleId: '',
};

Component({
  properties: {
    article: {
      type: Object,
      value: {},
    },
    circleId: {
      type: String,
      value: '',
      observer(newValue) {
        if (newValue) {
          this.fetchActivities();
        }
      },
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
    articles: [],
    bottomTips: '- END -',
    fetchedAll: false,
  },

  lifetimes: {
    attached() {},
    moved() {},
    detached() {},
  },

  ready() {},

  pageLifetimes: {
    show() {},
    hide() {},
    resize() {},
  },

  methods: {
    fetchActivities() {
      const that = this;
      const {
        circleId, page, pageSize, article,
      } = that.data;
      if (recommend.circleId !== circleId) {
        recommend.circleId = circleId;
        recommend.pageKey = '';
      }
      fetchCircleSmart({ id: circleId, pageKey: recommend.pageKey, pageSize })
        .then((res) => {
          if (res.data.status !== 0) {
            that.setData({
              fetchedAll: true,
            });
            return;
          }
          const {
            data,
          } = res.data;
          if (!data.length) {
            that.setData({
              fetchedAll: true,
            });
            return;
          }
          const articles = data.filter((element) => {
            const {
              influencerComments,
              authorId,
              covers: [cover],
              id: articleId,
            } = element;
            const result = element;
            const influencer = influencerComments.find(({ authorId: id }) => id === authorId);
            if (influencer) {
              const { comment, avatar } = influencer;
              influencer.avatar = formatImage(avatar, '/resize,w_100/quality,q_80');
              influencer.comment = comment.replace(/[\r\n]/g, '').replace(/(^\s*)|(\s*$)/g, '');
              result.influencer = influencer;
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
            if (article) {
              return articleId !== article.id;
            }
            return true;
          });

          if (data.length < pageSize) {
            that.setData({
              fetchedAll: true,
              [`articles[${page - 1}]`]: articles,
            });
          } else {
            that.setData({
              page: page + 1,
              [`articles[${page - 1}]`]: articles,
            });
          }
          recommend.pageKey = res.data.meta.pageKey;
        })
        .catch(() => {
          wx.navigateTo({
            url: '/pages/networkerror/index',
          });
        });
    },
  },
});
