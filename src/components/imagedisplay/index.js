Component({
  properties: {
    filePath: {
      type: String,
      value: '',
    },
  },

  data: {},

  methods: {
    onPreview() {
      const { filePath = '' } = this.data;
      this.triggerEvent('preview', {
        filePath,
      });
    },
  },
});
