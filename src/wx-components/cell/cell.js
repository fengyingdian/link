Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true,
  },
  properties: {
    hover: {
      type: Boolean,
      value: false,
    },
    link: {
      type: Boolean,
      value: false,
    },
    extClass: {
      type: String,
      value: '',
    },
    iconClass: {
      type: String,
      value: '',
    },
    bodyClass: {
      type: String,
      value: '',
    },
    icon: {
      type: String,
      value: '',
    },
    title: {
      type: String,
      value: '',
    },
    value: {
      type: String,
      value: '',
    },
    showError: {
      type: Boolean,
      value: false,
    },
    prop: {
      type: String,
      value: '',
    },
    url: {
      type: String,
      value: '',
    },
    footerClass: {
      type: String,
      value: '',
    },
    footer: {
      type: String,
      value: '',
    },
    inline: {
      type: Boolean,
      value: true,
    },
    hasHeader: {
      type: Boolean,
      value: true,
    },
    hasFooter: {
      type: Boolean,
      value: true,
    },
    hasBody: {
      type: Boolean,
      value: true,
    },
  },
  relations: {
    '../form/form': {
      type: 'ancestor',
    },
    '../cells/cells': {
      type: 'ancestor',
    },
  },
  data: {
    inForm: false,
  },
  methods: {
    setError: function setError(error) {
      this.setData({
        error: error || false,
      });
    },
    setInForm: function setInForm() {
      this.setData({
        inForm: true,
      });
    },
    setOuterClass: function setOuterClass(className) {
      this.setData({
        outerClass: className,
      });
    },
    navigateTo: function navigateTo() {
      const that = this;

      const { data } = this;
      if (data.url && data.link) {
        wx.navigateTo({
          url: data.url,
          success: function success(res) {
            that.triggerEvent('navigatesuccess', res, {});
          },
          fail: function fail(_fail) {
            that.triggerEvent('navigateerror', _fail, {});
          },
        });
      }
    },
  },
});
