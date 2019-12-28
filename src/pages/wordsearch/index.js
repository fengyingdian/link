Component({
  behaviors: [],
  properties: {
    isShowGoBack: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    // status bar height, for margin top
    statusBar: wx.getSystemInfoSync().statusBarHeight,

    // navigate title
    navigateTitle: 'sth',

    // search relative
    inputShowed: false,
    inputVal: '',

    // word list
    words: [],
  },

  methods: {
    onLoad() {
      this.setData({
        search: this.search.bind(this),
      });
    },
    search(value) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([{ text: `${value}`, value: 1 }, { text: `${value} + 1`, value: 2 }]);
        }, 200);
      });
    },
    selectResult(opts) {
      const { item: { text = '' } = {} } = opts.detail;
      if (text) {
        this.setData({
          words: [
            { text },
            ...this.data.words,
          ],
        });
      }
    },
    onRemove(opts) {
      const { index = 0 } = opts.detail;
      const { words = [] } = this.data;
      this.setData({
        words: [
          ...words.filter((_, i) => i !== index),
        ],
      });
    },
    onSubmit() {
      const { words = [] } = this.data;
      if (wx.getSearchedWordListCallBack) {
        wx.getSearchedWordListCallBack(words);
      }
      wx.navigateBack({
        delta: 1,
      });
    },
  },
});
