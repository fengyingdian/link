import { formatTime } from '../../../utils/util';
import { showActionSheet } from '../../../service/wxpromisify';

Component({
  properties: {
    postId: {
      type: String,
      value: '',
    },
    authorId: {
      type: String,
      value: '',
    },
    author: {
      type: Object,
      value: {},
    },
    title: {
      type: String,
      value: 'hello world',
    },
    description: {
      type: String,
      value: 'hello world',
    },
    images: {
      type: Array,
      value: ['https://sapp.flipboard.cn/assets/bk-a.jpg', 'https://sapp.flipboard.cn/assets/bk-b.jpg'],
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
    onPlay() {
      const { postId = '' } = this.data;
      this.triggerEvent('play', { id: postId });
    },

    onDetail() {
      const { postId = '' } = this.data;
      wx.navigateTo({
        url: `/pages/userpost/index?postId=${postId}`,
      });
    },

    onMore() {
      const that = this;
      const { authorId = '' } = that.data || {};
      const { OPENID = '' } = wx.appContext;
      if (authorId === OPENID) {
        showActionSheet({ itemList: ['delete'] })
          .then(({ tapIndex = -1 }) => {
            if (tapIndex === 0) {
              that.onRemovePost();
            }
          });
      }
    },

    onRemove() {
      const { postId = '' } = this.data;
      this.triggerEvent('remove', { postId });
    },
  },
});
