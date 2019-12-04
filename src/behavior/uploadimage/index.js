import { chooseImage } from '../../service/wxpromisify';

export const uploadimage = Behavior({
  behaviors: [],
  properties: {
  },
  data: {
    images: [],
    maxCount: 4,
  },
  attached() {
    Flimi.AppBase().logManager.log('upload image attached');
  },
  detached() {
    Flimi.AppBase().logManager.log('upload image detached');
  },

  methods: {
    async upload() {
      const { images = [], maxCount = 4 } = this.data;
      if (maxCount - images.length <= 0) {
        return;
      }
      const filePaths = await chooseImage({
        count: maxCount - images.length,
        type: 'image',
      })
        .then(res => {
          wx.showToast({
            title: '上传成功',
          });
          return res.tempFilePaths;
        })
        .catch(() => {
          wx.showToast({
            title: '上传失败',
            icon: 'none',
          });
          return '';
        });
      this.setData({
        images: images.concat(filePaths),
      });
    },

    delete(filePath) {
      const { images = [] } = this.data;
      this.setData({
        images: images.filter(src => src !== filePath),
      });
    },
  },
});

export default {};
