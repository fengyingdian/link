Component({
  behaviors: [],
  properties: {
    mimeId: {
      type: String,
      value: '',
    },
    openId: {
      type: String,
      value: '',
    },
    nickName: {
      type: String,
      value: '',
    },
    avatarUrl: {
      type: String,
      value: '',
    },
  },
  data: {
    navigateTitle: 'submit mime reply',
  },
  methods: {
    onLoad() {
      // const eventChannel = this.getOpenerEventChannel();
      // eventChannel.on('acceptDataFromOpenerPage', (data) => {
      //   console.log(data);
      // });
    },

    onReady() {},

    async onSubmit(opts) {
      const {
        replyAuthor,
        userInfo,
        text,
        audio,
        images,
      } = opts.detail || {};
      const {
        mimeId = '',
      } = this.data;
      // add to db
      const db = await wx.cloud.database();
      await db.collection('user_post_mime_replys').add({
        data: {
          mimeId,
          replyAuthor: {
            ...replyAuthor,
          },
          author: {
            ...userInfo,
          },
          audio,
          images,
          text,
          createdAt: Date.now(),
        },
      })
        .then(res => {
          if (res && res.errMsg === 'collection.add:ok') {
            wx.showToast({
              title: '回复成功',
            });
            if (wx.refreshPostMimeReplys) {
              wx.refreshPostMimeReplys();
            }
            wx.navigateBack({
              delta: 1,
            });
          }
        })
        .catch(res => {
          Flimi.AppBase().logManager.error(res);
          wx.showToast({
            title: '回复失败',
          });
        });
    },
  },
});
