
Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true,
  },
  properties: {
    closabled: {
      type: Boolean,
      value: true,
    },
    title: {
      type: String,
      value: '',
    },
    subTitle: {
      type: String,
      value: '',
    },
    extClass: {
      type: String,
      value: '',
    },
    desc: {
      type: String,
      value: '',
    },
    tips: {
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
      observer: '_showChange',
    },
    buttons: {
      type: Array,
      value: [],
    },
  },
  methods: {
    close(e) {
      const { type } = e.currentTarget.dataset;

      if (this.data.maskClosable || type === 'close') {
        this.setData({
          show: false,
        });
        this.triggerEvent('close');
      }
    },
    buttonTap(e) {
      const { index } = e.currentTarget.dataset;

      this.triggerEvent('buttontap', { index, item: this.data.buttons[index] }, {});
    },
  },
});
