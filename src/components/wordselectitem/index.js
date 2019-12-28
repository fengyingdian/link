Component({
  properties: {
    index: {
      type: Number,
      value: 0,
    },
    en: {
      type: String,
      value: 'test',
    },
    cn: {
      type: String,
      value: '测试',
    },
  },

  attached() {},

  ready() { },

  methods: {
    onRemove() {
      const { index = -1 } = this.data;
      this.triggerEvent('remove', { index });
    },
  },
});
