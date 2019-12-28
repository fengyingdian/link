
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    extClass: {
      type: String,
      value: '',
    },
    focus: {
      type: Boolean,
      value: false,
    },
    placeholder: {
      type: String,
      value: '搜索',
    },
    value: {
      type: String,
      value: '',
    },
    search: {
      type: Function,
      value: null,
    },
    throttle: {
      type: Number,
      value: 500,
    },
    cancelText: {
      type: String,
      value: '取消',
    },
    cancel: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    result: [],
  },
  lastSearch: Date.now(),
  lifetimes: {
    attached: function attached() {
      if (this.data.focus) {
        this.setData({
          searchState: true,
        });
      }
    },
  },
  methods: {
    clearInput() {
      this.setData({
        value: '',
      });
      this.triggerEvent('clear');
    },
    inputFocus(e) {
      this.triggerEvent('focus', e.detail);
    },
    inputBlur(e) {
      this.setData({
        focus: false,
      });
      this.triggerEvent('blur', e.detail);
    },
    showInput() {
      this.setData({
        focus: true,
        searchState: true,
      });
    },
    hideInput() {
      this.setData({
        searchState: false,
      });
    },
    inputChange(e) {
      const that = this;
      that.setData({
        value: e.detail.value,
      });
      that.triggerEvent('input', e.detail);
      if (Date.now() - that.lastSearch < that.data.throttle) {
        return;
      }
      if (typeof that.data.search !== 'function') {
        return;
      }
      that.lastSearch = Date.now();
      that.timerId = setTimeout(() => {
        that.data.search(e.detail.value).then((json) => {
          that.setData({
            result: json,
          });
        }).catch((err) => {
          Flimi.AppBase().logManager.log('search error', err);
        });
      }, that.data.throttle);
    },
    selectResult(e) {
      const { index } = e.currentTarget.dataset;

      const item = this.data.result[index];
      this.triggerEvent('selectresult', { index, item });
    },
  },
});
