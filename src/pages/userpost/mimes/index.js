Component({
  behaviors: [],
  properties: {
    postId: {
      type: String,
      value: '',
      observer(val) {
        if (val) {
          this.loadPreviews(val);
        }
      },
    },
    refresh: {
      type: Number,
      value: 0,
      observer(val) {
        if (val) {
          this.loadPreviews(this.data.postId);
        }
      },
    },
    previews: {
      type: Array,
      value: [],
    },
  },
  data: {},

  methods: {
    onReady() { },

    async loadPreviews(postId) {
      if (!postId) {
        return;
      }
      const that = this;
      const db = await wx.cloud.database();
      await db.collection('user_post_mimes')
        .orderBy('createdAt', 'desc')
        .where({
          postId,
        })
        .get()
        .then(res => {
          if (res && res.errMsg === 'collection.get:ok' && res.data.length > 0) {
            that.setData({
              previews: res.data,
            });
          } else {
            that.setData({
              previews: {},
            });
          }
        });
    },

    onAudioPlay(opts) {
      const { detail: { id = '' } = {} } = opts || {};
      const { previews } = this.data;
      previews.map((item) => {
        const temp = item;
        const { _id: itemId } = temp;
        temp.audio.isOrder = (id === itemId);
        return temp;
      });
      this.setData({
        previews,
      });
      this.triggerEvent('play');
    },
  },
});
