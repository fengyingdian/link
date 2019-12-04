Component({
  properties: {
    hasMoreItem: {
      type: Boolean,
      value: true,
    },
  },

  data: {
    tips: '- END -',
  },

  lifetimes: {
    attached() {},
    detached() {},
  },

  methods: {
  },
});
