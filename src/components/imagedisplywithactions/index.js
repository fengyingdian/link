Component({
  properties: {
    filePath: {
      type: String,
      value: '',
    },
  },

  data: {},

  methods: {
    onRemove() {
      const { filePath = '' } = this.data;
      this.triggerEvent('delete', {
        filePath,
      });
    },
  },
});
