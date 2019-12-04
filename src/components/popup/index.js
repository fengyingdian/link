Component({
  properties: {
    isShow: {
      type: Boolean,
      value: false,
      observer(value) {
        if (value) {
          this.show();
        } else {
          this.hide();
        }
      },
    },
    zIndex: {
      type: Number,
      value: 20,
    },
  },

  methods: {
    onTap() {
      this.triggerEvent('hide');
    },

    show() {
      const that = this;
      that.setData({
        isShowPage: true,
      });
      setTimeout(() => {
        that.setData({
          isPopUp: true,
        });
      }, 10);
    },

    hide() {
      const that = this;
      that.setData({
        isPopUp: false,
      });
      setTimeout(() => {
        that.setData({
          isShowPage: false,
        });
      }, 300);
    },
  },
});
