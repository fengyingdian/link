import { getUserStatus } from '../../common/service/userstatus/index';
import { getArticleComment } from '../../common/service/comment/index';
import { userStatusDrawBehavior } from '../userstatusdraw/index';
import { getWechatCode } from '../../service/userstatus';

export const userStatusBehavior = Behavior({
  behaviors: [userStatusDrawBehavior],
  properties:
  {
    statusId: {
      type: String,
      value: '',
      observer(newValue) {
        if (newValue) {
          this.init(newValue);
        }
      },
    },
    scene: {
      type: String,
      value: '',
      observer(newValue) {
        if (newValue) {
          this.setData({ statusId: newValue });
          this.init(newValue);
        }
      },
    },
    selectedCommentId: {
      type: String,
      value: '',
    },
    comment: {
      type: Object,
      value: {},
    },
    article: {
      type: Object,
      value: {},
    },
    hashtag: {
      type: Object,
      value: {},
    },
    comments: {
      type: Array,
      value: [],
    },
  },
  data: {
  },
  attached() {
  },
  onReady() {
  },
  methods: {
    init(statusId) {
      const that = this;
      getWechatCode(statusId);
      getUserStatus(statusId)
        .then((res) => {
          const {
            comment = {}, article = {}, hashtag = {},
          } = res || {};
          that.setData({
            comment,
            article,
            hashtag,
          });
          setTimeout(() => {
            that.setData({
              'showMgr.page': true,
            });
          }, 300);
          return article;
        })
        .then((article) => {
          const { url = '' } = article || {};
          return getArticleComment({ url: encodeURIComponent(url) });
        })
        .then((comments) => {
          that.setData({
            comments,
          });
        })
        .then(() => {
          const { comment = {}, article = {} } = that.data;
          that.drawCover(comment, article);
        });
    },
  },
});

export default {};
