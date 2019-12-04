Component({
  properties: {
    count: {
      type: Number,
      value: 0,
    },
  },

  methods: {
    onLoadMore() {
      this.triggerEvent('loadmorecomment');
    },
  },
});
