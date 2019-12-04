Component({
  properties: {
    status: {
      type: Number,
      value: false,
      observer(value) {
        this.action(value);
      },
    },
    zIndex: {
      type: Number,
      value: 20,
    },
  },

  methods: {
    action(status) {
      if (status) {
        this.setData({
          isShow: true,
          isUp: false,
        });
      } else {
        this.setData({
          isUp: true,
        });
        setTimeout(() => {
          this.setData({
            isShow: false,
          });
        }, 300);
      }
    },
  },
});
