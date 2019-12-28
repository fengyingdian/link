Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true,
  },
  properties: {
    title: {
      type: String,
      value: '',
    },
    showCancel: {
      type: Boolean,
      value: true,
    },
    cancelText: {
      type: String,
      value: '取消',
    },
    maskClass: {
      type: String,
      value: '',
    },
    extClass: {
      type: String,
      value: '',
    },
    maskClosable: {
      type: Boolean,
      value: true,
    },
    mask: {
      type: Boolean,
      value: true,
    },
    show: {
      type: Boolean,
      value: false,
    },
    actions: {
      type: Array,
      value: [],
      observer: '_groupChange',
    },
  },
  methods: {
    // eslint-disable-next-line no-underscore-dangle
    _groupChange(e) {
      if (e.length > 0 && typeof e[0] !== 'string' && !(e[0] instanceof Array)) {
        this.setData({
          actions: [this.data.actions],
        });
      }
    },
    buttonTap(e) {
      const { value, groupindex, index } = e.currentTarget.dataset;
      this.triggerEvent('actiontap', { value, groupindex, index });
    },
    closeActionSheet(e) {
      const { type } = e.currentTarget.dataset;
      if (this.data.maskClosable || type) {
        this.setData({
          show: false,
        });
        this.triggerEvent('close');
      }
    },
  },
});
