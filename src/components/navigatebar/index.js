Component({
  properties: {
    title: {
      type: String,
      value: wx.env.navigationBarTitle,
      observer(newValue) {
        if (newValue === wx.env.navigationBarTitle) {
          this.setData({
            show: 'showInmediately',
            avatarShow: false,
          });
        } else {
          this.setData({
            show: 'hideInmediately',
          });
          if (this.data.avatar && this.data.avatar.length > 0) {
            this.setData({
              avatarShow: true,
            });
          }
          setTimeout(() => {
            this.setData({
              show: 'showTransition',
            });
          }, 100);
        }
      },
    },
    avatar: {
      type: String,
      value: '',
    },
    home: {
      type: Boolean,
      value: true,
    },
    status: {
      type: Number,
      value: 0,
    },
    zIndex: {
      type: Number,
      value: 10,
    },
  },

  data: {
    statusBar: wx.getSystemInfoSync().statusBarHeight,
    goBack: false,
    show: 'showInmediately',
  },

  attached() { },

  ready() {
    this.setData({
      goBack: Boolean(getCurrentPages().length > 1),
    });
  },

  methods: {
    tapGoBack() {
      wx.navigateBack();
    },

    tapHome() {
      wx.reLaunch({
        url: '/pages/index/index',
      });

      // const currentPages = getCurrentPages();

      // // user enter flimi from vcomment, such as:
      // // share card / share poster / notification
      // if (currentPages.length === 1) {
      //   wx.reLaunch({
      //     url: '/pages/index/index',
      //   });
      // } else if (currentPages.length === 2) {
      //   wx.navigateBack({
      //     delta: 1,
      //   });
      // } else {
      //   wx.reLaunch({
      //     url: '/pages/index/index',
      //   });
      // }
    },
  },
});
