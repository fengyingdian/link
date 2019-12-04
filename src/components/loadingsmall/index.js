Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
  },

  data: {

  },

  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      // this.handle = setInterval({
      //
      // }, 500);
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
      clearInterval(this.handle);
    },
  },

  methods: {
  },
});
