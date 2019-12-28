Component({
  behaviors: [],
  properties: {},
  data: {
    navigateTitle: 'submit post',
  },
  methods: {
    async onSubmit(opts) {
      const {
        userInfo,
        title,
        description,
        audio,
        images,
        words,
      } = opts.detail || {};
      // add to db
      const db = await wx.cloud.database();
      await db.collection('user_posts').add({
        data: {
          author: {
            ...userInfo,
          },
          audio,
          images,
          words,
          title,
          description,
          createdAt: Date.now(),
          visitors: [],
        },
      })
        .then(res => {
          if (res && res.errMsg === 'collection.add:ok') {
            wx.showToast({
              title: '发布成功',
            });
            if (wx.previewRefresh) {
              wx.previewRefresh();
            }
            wx.navigateBack({
              delta: 1,
            });
          }
        })
        .catch(res => {
          Flimi.AppBase().logManager.error(res);
          wx.showToast({
            title: '发布失败',
          });
        });
    },
  },
});
