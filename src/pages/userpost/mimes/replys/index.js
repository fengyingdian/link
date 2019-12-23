import { formatTime } from '../../../../utils/util';

Component({
  properties: {
    replyId: {
      type: String,
      value: '',
    },
    author: {
      type: Object,
      value: {},
    },
    replyAuthor: {
      type: Object,
      value: {},
      observer(val) {
        if (val && Object.keys(val).length > 0) {
          const { nickName = '' } = val;
          Flimi.AppBase().logManager.log('reply ', nickName);
        }
      },
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
    isShowSplitLine: {
      type: Boolean,
      value: false,
    },
  },

  data: {},

  methods: {
    onPlay() {
      const { replyId = '' } = this.data;
      this.triggerEvent('play', { id: replyId });
    },

    onReply() {
      const { author = {} } = this.data;
      this.triggerEvent('reply', { author });
    },
  },
});
