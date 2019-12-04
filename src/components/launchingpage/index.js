Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    trigger: 0,
    commentTransition: 'comment-card-down',
  },

  attached() {},

  ready() {
    const that = this;
    const intervalId = setInterval(() => {
      if (!that.data.show) {
        clearInterval(that.data.intervalId);
      }
      if (that.data.trigger === 0) {
        that.setData({
          commentTransition: 'comment-card-show',
          trigger: 1,
        });
      } else if (that.data.trigger === 1) {
        that.setData({
          trigger: 2,
        });
      } else if (that.data.trigger === 2) {
        that.setData({
          commentTransition: 'comment-card-hide',
          trigger: 3,
        });
      } else if (that.data.trigger === 3) {
        that.setData({
          commentTransition: '',
          trigger: 0,
        });
      } else {
        clearInterval(that.data.intervalId);
      }
    }, 1000);
    that.setData({
      intervalId,
    });
  },

  lifetimes: {
    attached() {},
    moved() {
      clearInterval(this.intervalId);
    },
    detached() {
      clearInterval(this.intervalId);
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {},
});
