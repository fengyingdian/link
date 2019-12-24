export const login = Behavior({
  behaviors: [],
  properties: {
    shareOpenId: {
      type: String,
      value: '',
    },
  },
  data: {
    // check if is login
    isLogin: false,
  },
  attached() {
    Flimi.AppBase().logManager.log('login attached');
  },
  detached() {
    Flimi.AppBase().logManager.log('login detached');
  },

  methods: {
    async checkLogin(callback = () => {}) {
      const that = this;
      that.setData({
        isLogin: getApp().isLogin(),
      });
      if (this.data.isLogin) {
        callback();
      }
      // waitting for callback
      getApp().getUserInfoCallBack = (res) => {
        if (res) {
          that.setData({
            isLogin: getApp().isLogin(),
          });
          // eslint-disable-next-line no-unused-expressions
          callback();
        } else {
          wx.navigateTo({
            url: '/pages/login/index',
          });
        }
      };
    },
  },
});

export default {};
