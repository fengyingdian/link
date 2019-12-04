// components/influencerheader/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name: {
      type: String,
      value: '',
    },
    description: {
      type: String,
      value: '这里是简介',
    },
    total: {
      type: Number,
      value: 500,
    },
    Influencers: {
      type: Array,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  attached() {},

  ready() {
  },
  /**
   * 组件的方法列表
   */
  methods: {
  },
});
