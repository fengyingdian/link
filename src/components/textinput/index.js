const app = getApp();

Component({
  properties: {
    focus: {
      type: Boolean,
      value: false,
    },
    placeholder: {
      type: String,
      value: '',
    },
  },

  data: {
    content: '',
    isDisbleSubmit: false,
    adjustPosition: false,
    showConfirmBar: true,
    fixed: false,
    keyboardHeight: 0,
  },

  attached() {},

  ready() {},

  methods: {
    userInput(e) {
      const { value: content = '' } = e.detail;
      this.setData({
        content,
      });
      this.triggerEvent('change', { content });
    },

    keyBoardHeightChange(ops) {
      // Flimi.AppBase().logManager.log('keyBoardHeightChange', ops);
      if (ops.detail.height > this.data.keyboardHeight) {
        this.setData({
          keyboardHeight: ops.detail.height,
        });
      }
    },

    focus(ops) {
      // Flimi.AppBase().logManager.log('focus', ops);
      if (ops.detail.height > this.data.keyboardHeight) {
        this.setData({
          keyboardHeight: ops.detail.height,
        });
      }
    },

    onSubmit() {
      const that = this;
      const content = that.data.content.replace(/(^\s*)|(\s*$)/g, '');
      if (content.length < 1) {
        wx.showToast({
          title: '内容为空',
          icon: 'fail',
          duration: 1500,
        });
      }
    },

    onBlur() {
      // this.triggerEvent('submit', { refresh: false });
    },

    onAfterSumbmit(content) {
      if (app.onRespondCommentSubmitCallback) {
        app.onRespondCommentSubmitCallback(content);
      }
      this.triggerEvent('submit', { refresh: true, content });
    },
  },
});
