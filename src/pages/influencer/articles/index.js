// pages/index/index.js
import { fetchInfluencerSmart } from '../../../service/api';
import { formatTime, formatImage } from '../../../utils/util';

Component({
  properties: {
    article: {
      type: Object,
      value: null,
    },
    influencer: {
      type: Object,
      value: null,
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
    bottomTips: '- END -',
    fetchedAll: false,
    articles: [],
  },

  methods: {
    fetchActivities() {
      const that = this;
      const {
        influencer, page, pageSize, articles,
      } = that.data;
      fetchInfluencerSmart({ userid: influencer.id, page, pageSize })
        .catch(() => {
          wx.navigateTo({
            url: '/pages/networkerror/index',
          });
        })
        .then((res) => {
          const { articles: data = [] } = res.data.data;
          if (!data.length) {
            that.setData({
              fetchedAll: true,
            });
            return;
          }
          data.map((element) => {
            const {
              postedAt,
              comment: { content },
              covers: [cover],
            } = element;
            const result = element;
            result.influencer = {
              ...influencer,
              time: formatTime(new Date(postedAt)),
              avatar: formatImage(influencer.avatar, '/resize,w_100/quality,q_80'),
              comment: content.replace(/[\r\n]/g, '').replace(/(^\s*)|(\s*$)/g, ''),
            };

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
              articles: [...articles, data],
            });
          } else {
            that.setData({
              articles: [...articles, data],
              page: page + 1,
            });
          }
        });
    },

    tapArticle() {},
  },
});
