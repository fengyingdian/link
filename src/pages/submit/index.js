import { uploadimage } from '../../behavior/uploadimage/index';

Component({
  behaviors: [uploadimage],
  properties: {
    actions: {
      type: Object,
      value: {
        audio: {
          name: 'audio', isShow: true, icon: '../../../assets/icons/audio.png', action: 'onAudio',
        },
        image: {
          name: 'image', isShow: true, icon: '../../../assets/icons/image.png', action: 'onImage',
        },
      },
    },
  },
  data: {
    // status bar height, for margin top
    statusBar: wx.getSystemInfoSync().statusBarHeight,

    // navigate title
    navigateTitle: '发布',
    // navigate z-index fro some reasons
    // we need to set navigate bar's z-index to  0
    navigateIndexZ: 10,

    // check if is login
    isLogin: false,

    // record tempFilePath
    tempFilePath: '',
  },

  methods: {
    onReady() {
      this.setData({
        actionKeys: Object.keys(this.data.actions),
      });
    },

    checkLogin() {
      const that = this;
      that.setData({
        isLogin: getApp().isLogin(),
      });
      // waitting for callback
      getApp().getUserInfoCallBack = () => {
        that.setData({
          isLogin: getApp().isLogin(),
        });
      };
    },

    //
    // ─── AUDIO ───────────────────────────────────────────────────────
    //
    onAudio() {
      Flimi.AppBase().logManager.log('onAudio');
      this.setData({
        isRecording: true,
      });
    },

    onStopRecorder(opts) {
      const { detail: { iscancle = false, tempFilePath = '' } = {} } = opts;
      Flimi.AppBase().logManager.log('onStopAudio', opts);
      this.setData({
        isRecording: false,
      });
      if (iscancle) {
        this.setData({
          tempFilePath: '',
        });
      } else {
        const { actions = {} } = this.data;
        actions.audio.isShow = false;
        this.setData({
          actions,
          tempFilePath,
        });
      }
    },

    onDeleteAudio() {
      const { actions = {} } = this.data;
      actions.audio.isShow = true;
      this.setData({
        actions,
        tempFilePath: '',
      });
    },

    //
    // ─── IMAGE ───────────────────────────────────────────────────────
    //
    onImage() {
      this.upload();
    },

    onDeleteImage(opts) {
      const { detail: { filePath = '' } = {} } = opts;
      this.delete(filePath);
    },

    /**
     * 用户点击右上角分享
     * 用户点击分享按钮分享 res.form: button
     */
    onShareAppMessage(opts) {
      const that = this;
      const {
        imageUrl = '',
        article: { title = '', image: cover = '' } = {},
        statusId = '',
        selectedShareItem,
      } = that.data;
      const { target: { dataset: { type = '' } } } = opts;

      if (opts.from === 'button' && selectedShareItem && type !== 'article') {
        const { comment = '', isTop = '' } = selectedShareItem;
        if (!isTop) {
          return {
            path: `/pages/userstatus/index?statusId=${statusId}`,
            title: `${comment.authorDisplayName}分享了这篇文章，围观一下？`,
            imageUrl: that.data.shareUrl,
          };
        }
        return {
          path: `/pages/userstatus/index?statusId=${statusId}`,
          title,
          imageUrl,
        };
      }
      return {
        path: `/pages/userstatus/index?statusId=${statusId}`,
        title,
        imageUrl: cover,
      };
    },
  },
});
