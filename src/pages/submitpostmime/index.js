import { userpostinfo } from '../../behavior/userpostinfo/index';

Component({
  behaviors: [userpostinfo],
  properties: {
    postId: {
      type: String,
      value: '',
      observer(val) {
        if (val) {
          this.getPostData();
        }
      },
    },
  },
  data: {
    // status bar height, for margin top
    statusBar: wx.getSystemInfoSync().statusBarHeight,

    // navigate z-index fro some reasons
    // we need to set navigate bar's z-index to  0
    navigateTitle: '',
    navigateIndexZ: 10,

    //
    isShowPost: true,
    postHideCalc: `calc(${wx.getSystemInfoSync().statusBarHeight + 45}px - 100%)`,
  },

  methods: {
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

    onAction() {
      this.setData({
        isShowPost: !this.data.isShowPost,
      });
    },
  },
});
