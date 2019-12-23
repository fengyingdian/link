Component({
  behaviors: [],
  properties: {
    postId: {
      type: String,
      value: '',
    },
  },
  data: {
    navigateTitle: 'submit mime',
  },
  methods: {
    onReady() {},

    async onSubmit(opts) {
      const {
        userInfo,
        text,
        audio,
        images,
      } = opts.detail || {};
      const { postId = '' } = this.data;
      // add to db
      const db = await wx.cloud.database();
      await db.collection('user_post_mimes').add({
        data: {
          postId,
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
              title: '添加练习成功',
            });
            if (wx.refreshPostMimes) {
              wx.refreshPostMimes();
            }
            wx.navigateBack({
              delta: 1,
            });
          }
        })
        .catch(res => {
          Flimi.AppBase().logManager.error(res);
          wx.showToast({
            title: '添加练习失败',
          });
        });
    },
  },
});
