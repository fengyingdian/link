Component({
  properties: {
    titleSelected: {
      type: Number,
      value: 0,
      // observer(newVal, oldVal, changedPath) {
      //   // Flimi.AppBase().logManager.log('tab-top', newVal, oldVal, changedPath, this);
      // },
    },
  },

  data: {
    titles: [{ name: '短评热榜' }, { name: '我的收藏' }],
    statusBar: wx.getSystemInfoSync().statusBarHeight,
    avatar: 'http://sapp.flipboard.cn/static/assets/ios-user-2.png',
  },

  attached() {},

  ready() {},

  pageLifetimes: {
    show() {
      const that = this;
      that.privateSetAvatar();

      const app = getApp();
      app.getUserInfoCallBack = () => {
        that.privateSetAvatar();
      };
    },
    hide() {},
    resize() {},
  },

  methods: {
    privateSetAvatar() {
      const {
        globalData: { userInfo },
      } = getApp();
      if (userInfo) {
        this.setData({
          avatar: userInfo.avatar,
        });
      }
    },

    onTap(e) {
      // Flimi.AppBase().logManager.log('select', e.currentTarget.id);
      this.setData({
        titleSelected: e.currentTarget.id,
      });
      const myEventDetail = { titleSelected: e.currentTarget.id };
      const myEventOption = {};
      this.triggerEvent('select', myEventDetail, myEventOption);
    },
  },
});
