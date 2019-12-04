import { fetchActivitiesSmart } from '../../../service/api';
import { formatDate, formatTime, formatImage } from '../../../utils/util';

Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    perPage: 6,
    pageKey: '',
    articles: [],
    bottomTips: '- END -',
    fetchedAll: false,
  },

  attached() { },

  ready() {
    this.initArticleData();
    this.fetchActivities();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initArticleData() {
      this.setData({
        articles: [],
        bottomTips: '- END -',
        fetchedAll: false,
      });
      this.data.pageKey = '';
      this.data.perPage = 6;
    },

    fetchActivities(isPullDown) {
      const that = this;
      const { pageKey, perPage, articles } = that.data;
      const { theOldArticle, theOldKey } = (() => {
        if (isPullDown) {
          return {
            theOldArticle: [],
            theOldKey: '',
          };
        }
        return {
          theOldArticle: articles,
          theOldKey: pageKey,
        };
      })();
      fetchActivitiesSmart({ pageKey: theOldKey, perPage })
        .then((res) => {
          const {
            data,
            meta: { pageKey: newpageKey = '' },
            status,
          } = res.data;

          if (status !== 0) {
            wx.navigateTo({
              url: '/pages/networkerror/index',
            });
          }

          if (articles.length > 0) {
            const [article] = data;
            const [[oldArticle]] = articles;
            if (article.id === oldArticle.id) {
              return;
            }
          }

          data.map((element) => {
            const {
              authorId,
              influencerComments,
              homefeedComments,
              publishedAt,
              createdAt,
              title,
              covers: [cover],
            } = element;
            const result = element;

            // influencer
            const influencer = influencerComments.find(({ authorId: id }) => id === authorId);
            if (influencer) {
              result.influencer = influencer;
              const { fullSlug, comment, avatar } = influencer;
              result.commentTime = formatTime(new Date(parseInt(fullSlug.slice(0, 10), 10) * 1000));
              influencer.avatar = formatImage(avatar, '/resize,w_100/quality,q_80');
              influencer.comment = comment.replace(/[\r\n]/g, '').replace(/(^\s*)|(\s*$)/g, '');
            }

            // prime
            result.prime = (() => {
              if (homefeedComments && homefeedComments.length > 0) {
                return homefeedComments[0];
              }
              return null;
            })();

            // cover
            result.coverSrc = (() => {
              if (cover) {
                return formatImage(cover.url, '/resize,w_400/quality,q_95');
              }
              // TODO
              // need a default cover image
              return '';
            })();

            result.time = formatDate(new Date(publishedAt));
            result.createdTime = formatTime(new Date(createdAt));
            result.title = title.replace(/&quot;/g, '');
            return result;
          });

          if (data.length < 1) {
            that.setData({
              fetchedAll: true,
              articles: [...theOldArticle, data],
            });
          } else {
            that.setData({
              articles: [...theOldArticle, data],
            });
            that.data.pageKey = newpageKey;
          }

          // if the launching page is showing
          // stop it at this time
          // this.stopLaunchingPage();
        })
        .catch(() => {
          wx.navigateTo({
            url: '/pages/networkerror/index',
          });
        });
    },
  },
});
