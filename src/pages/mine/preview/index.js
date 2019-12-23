import { formatTime } from '../../../utils/util';

Component({
  properties: {
    postId: {
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
      const { postId } = this.data;
      this.triggerEvent('play', { id: postId });
    },

    onDetail() {
      const { postId } = this.data;
      wx.navigateTo({
        url: `/pages/userpost/index?postId=${postId}`,
      });
    },
  },
});
