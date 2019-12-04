Component({
  properties: {
    titleSelected: {
      type: Number,
      value: 0,
      // observer(newVal, oldVal, changedPath) {
      //   // Flimi.AppBase().logManager.log('tab-top', newVal, oldVal, changedPath, this);
      // },
    },
  },

  data: {
    titles: [{ name: '动态' }, { name: '档案' }],
  },

  attached() {},

  ready() {},

  methods: {
    onTap(e) {
      // Flimi.AppBase().logManager.log('select', e.currentTarget.id);
      this.setData({
        titleSelected: e.currentTarget.id,
      });
      const myEventDetail = { titleSelected: e.currentTarget.id };
      const myEventOption = {};
      this.triggerEvent('select', myEventDetail, myEventOption);
    },
  },
});
