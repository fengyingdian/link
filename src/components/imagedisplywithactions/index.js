Component({
  properties: {
    filePath: {
      type: String,
      value: '',
    },
  },

  data: {},

  methods: {
    onDelete() {
      const { filePath = '' } = this.data;
      this.triggerEvent('delete', {
        filePath,
      });
    },
  },
});
