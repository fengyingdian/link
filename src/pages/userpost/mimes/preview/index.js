import { formatTime } from '../../../../utils/util';
import { showActionSheet } from '../../../../service/wxpromisify';

Component({
  properties: {
    mimeId: {
      type: String,
      value: '',
      observer(val) {
        if (val) {
          this.loadPreviews(val);
        }
      },
    },
    authorId: {
      type: String,
      value: '',
    },
    author: {
      type: Object,
      value: {},
    },
    text: {
      type: String,
      value: 'hello world',
    },
    images: {
      type: Array,
      value: [],
    },
    audio: {
      type: Object,
      value: {
        src: '',
        isOrder: false,
        duration: 0,
      },
    },
    createdAt: {
      type: Number,
      value: 0,
      observer(val) {
        if (val) {
          const timer = formatTime(new Date(val));
          this.setData({
            timer,
          });
        }
      },
    },
  },

  data: {},

  methods: {
    async loadPreviews(mimeId) {
      if (!mimeId) {
        return;
      }
      const that = this;
      wx.cloud.callFunction({
        name: 'getMimeReplys',
        data: {
          mimeId,
        },
      })
        .then(res => {
          if (res && res.errMsg === 'cloud.callFunction:ok' && res.result.length > 0) {
            that.setData({
              replys: [
                ...res.result,
              ],
            });
          }
        });
    },

    onPlay() {
      const { mimId = '' } = this.data;
      this.triggerEvent('play', { id: mimId });
    },

    onReply(opts) {
      const that = this;
      const { mimeId = '' } = that.data;
      const {
        detail: {
          author: { _openid: openId = '', nickName = '', avatarUrl = '' } = {},
        } = {},
      } = opts || {};
      wx.refreshPostMimeReplys = () => {
        that.loadPreviews(mimeId);
      };
      wx.navigateTo({
        url: `/pages/submitpostmimereply/index?mimeId=${mimeId}&openId=${openId}&nickName=${nickName}&avatarUrl=${avatarUrl}`,
      });
    },

    onMore() {
      const that = this;
      const { authorId = '' } = that.data || {};
      const { OPENID = '' } = wx.appContext;
      const itemList = ['reply'];
      if (authorId === OPENID) {
        itemList.push('delete');
      }
      showActionSheet({ itemList })
        .then(({ tapIndex = -1 }) => {
          if (tapIndex === 0) {
            that.onReply();
          } else if (tapIndex === 1) {
            that.onRemove();
          }
        });
    },

    onRemove() {
      const { mimeId = '' } = this.data;
      this.triggerEvent('remove', { mimeId });
    },

    onRemoveReply(opts) {
      const that = this;
      const { replys = [] } = this.data;
      const { detail: { replyId = '' } = {} } = opts || {};
      wx.cloud.callFunction({
        name: 'updateMimeReplyStatus',
        data: {
          replyId,
          isRemoved: true,
        },
      })
        .then((res) => {
          if (res && res.errMsg === 'cloud.callFunction:ok') {
            that.setData({
              replys: [
                ...replys.filter(({ _id: id }) => id !== replyId),
              ],
            });
          }
        })
        .catch(Flimi.AppBase().logManager.error);
    },
  },
});
