import { uploadfile } from '../../../behavior/uploadfile/index';
import { uploadimage } from '../../../behavior/uploadimage/index';
import { getSetting, authorize } from '../../../service/wxpromisify';

Component({
  behaviors: [uploadfile, uploadimage],
  properties: {
    actions: {
      type: Object,
      value: {
        audio: {
          name: 'audio', isShow: true, icon: '/assets/icons/audio.png', action: 'onAudio',
        },
        image: {
          name: 'image', isShow: true, icon: '/assets/icons/image.png', action: 'onImage',
        },
      },
    },
  },
  data: {
    // status bar height, for margin top
    statusBar: wx.getSystemInfoSync().statusBarHeight,

    // navigate z-index fro some reasons
    // we need to set navigate bar's z-index to  0
    navigateIndexZ: 10,

    // check if is login
    isLogin: false,
  },

  lifetimes: {
    attached() {
      getSetting()
        .then((res) => {
          const { authSetting } = res;
          if (!authSetting['scope.record']) {
            authorize({ scope: 'scope.record' })
              .catch(Flimi.AppBase().logManager.error);
          }
          if (!authSetting['scope.camera']) {
            authorize({ scope: 'scope.camera' })
              .catch(Flimi.AppBase().logManager.error);
          }
        })
        .catch(Flimi.AppBase().logManager.error);

      this.setData({
        actionKeys: Object.keys(this.data.actions),
      });
    },
    moved() { },
    detached() { },
  },

  methods: {
    //
    // ─── TEXT ────────────────────────────────────────────────────────
    //
    onInputChange(opts) {
      const { detail: { content = '' } = {} } = opts;
      if (content) {
        this.setData({
          text: content,
        });
      }
    },

    //
    // ─── AUDIO ───────────────────────────────────────────────────────
    //
    async onAudio() {
      Flimi.AppBase().logManager.log('onAudio');
      const isAuthorized = await getSetting()
        // eslint-disable-next-line consistent-return
        .then((res) => {
          const { authSetting } = res;
          if (authSetting['scope.record']) {
            return true;
          }
          wx.showModal({
            title: '未授权录音权限',
            content: '去授权？',
            cancelText: '取消',
            // cancelColor: '#000000',
            confirmText: '确定',
            // confirmColor: '#3CC51F',
            success: ({ confirm = false }) => confirm && wx.openSetting(),
          });
          return false;
        })
        .catch(Flimi.AppBase().logManager.log);
      if (isAuthorized) {
        this.setData({
          isRecording: true,
        });
      }
    },

    onStopRecorder(opts) {
      Flimi.AppBase().logManager.log('onStopAudio', opts);
      const {
        detail: {
          iscancle = false, tempFilePath = '', duration = 0, fileSize = 0,
        } = {},
      } = opts || {};
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
          duration,
          fileSize,
        });
      }
    },

    onDeleteAudio() {
      const { actions = {} } = this.data;
      actions.audio.isShow = true;
      this.setData({
        actions,
        tempFilePath: '',
        duration: '',
        fileSize: '',
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

    //
    // ─── SUBMIT ──────────────────────────────────────────────────────
    //
    async onSubmit() {
      const { userInfo = {} } = getApp().globalData;
      if (!userInfo.nickName) {
        return;
      }
      const {
        tempFilePath = '', duration, fileSize, images = [], text = '',
      } = this.data;
      // upload audio
      const src = await this.uploadFile(`user/post/audio/${wx.appContext.OPENID}`, tempFilePath);
      // upload images
      const fileIds = await this.uploadFiles(`user/post/images/${wx.appContext.OPENID}`, images);
      // submit
      this.triggerEvent('submit', {
        userInfo,
        text,
        audio: {
          src,
          duration,
          fileSize,
        },
        images: [
          ...fileIds,
        ],
      });
    },
  },
});
