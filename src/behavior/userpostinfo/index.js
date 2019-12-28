import { formatTime } from '../../utils/util';

export const userpostinfo = Behavior({
  behaviors: [],
  properties: {},
  data: {},
  attached() {
    Flimi.AppBase().logManager.log('userpostpin attached');
  },
  detached() {
    Flimi.AppBase().logManager.log('userpostpin detached');
  },

  methods: {
    async getPostData() {
      const that = this;
      const { postId = '' } = this.data;
      const db = await wx.cloud.database();
      await db.collection('user_posts')
        .where({
          _id: postId,
        })
        .get()
        .then(res => {
          if (res && res.errMsg === 'collection.get:ok' && res.data.length > 0) {
            const [post = {}] = res.data;
            const { createdAt = -1 } = post;
            const timer = formatTime(new Date(createdAt));
            that.setData({
              ...post,
              timer,
            });
          }
        });
    },
  },
});

export default {};
