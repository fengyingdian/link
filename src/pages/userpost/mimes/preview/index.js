import { formatTime } from '../../../../utils/util';

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
      const db = await wx.cloud.database();
      await db.collection('user_post_mime_replys')
        .orderBy('createdAt', 'desc')
        .where({
          mimeId,
        })
        .get()
        .then(res => {
          if (res && res.errMsg === 'collection.get:ok' && res.data.length > 0) {
            that.setData({
              replys: res.data,
            });
          } else {
            that.setData({
              replys: {},
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
        // success(res) {
        //   res.eventChannel.emit('acceptDataFromOpenerPage', { author });
        // },
      });
    },
  },
});
