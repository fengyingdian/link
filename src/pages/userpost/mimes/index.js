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
      wx.cloud.callFunction({
        name: 'getPostMimes',
        data: {
          postId,
        },
      })
        .then(res => {
          if (res && res.errMsg === 'cloud.callFunction:ok' && res.result.length > 0) {
            that.setData({
              previews: [
                ...res.result,
              ],
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

    onRemove(opts) {
      const that = this;
      const { previews = [] } = this.data;
      const { detail: { mimeId = '' } = {} } = opts || {};
      wx.cloud.callFunction({
        name: 'updatePostMimeStatus',
        data: {
          mimeId,
          isRemoved: true,
        },
      })
        .then((res) => {
          if (res && res.errMsg === 'cloud.callFunction:ok') {
            that.setData({
              previews: [
                ...previews.filter(({ _id: id }) => id !== mimeId),
              ],
            });
          }
        })
        .catch(Flimi.AppBase().logManager.error);
    },
  },
});
