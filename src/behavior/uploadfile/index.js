export const uploadfile = Behavior({
  behaviors: [],
  properties: {
  },
  attached() {
    Flimi.AppBase().logManager.log('upload image attached');
  },
  detached() {
    Flimi.AppBase().logManager.log('upload image detached');
  },

  methods: {
    async uploadFile(dir, filePath) {
      if (!filePath) {
        return '';
      }
      const type = filePath.split('.').pop();
      return wx.cloud.uploadFile({
        cloudPath: `${dir}/${Date.now()}.${type}`,
        filePath,
      })
        .then(res => res.fileID)
        .catch(Flimi.AppBase().logManager.error);
    },

    async uploadFiles(dir, filePathes) {
      if (!filePathes || filePathes.length < 1) {
        return [];
      }
      const that = this;

      // const id = await that.uploadFile(dir, filePathes[0]);
      // Flimi.AppBase().logManager.log('upload end2:', id);
      // return id;
      // because Promise.all() have bugs in production environment
      return Promise.all(filePathes.map(file => that.uploadFile(dir, file)));

      // now using reduce as alternative plan
      // const { result: res } = await filePathes.reduce(async (acc) => {
      //   const { result, ori } = await acc;
      //   const file = ori.pop();
      //   Flimi.AppBase().logManager.log('upload start2: ', file);
      //   const fileId = await that.uploadFile(dir, file);
      //   Flimi.AppBase().logManager.log('upload end2: ', fileId);
      //   return Promise.resolve({
      //     result: [
      //       ...result,
      //       fileId,
      //     ],
      //     ori: [
      //       ...ori,
      //     ],
      //   });
      // }, Promise.resolve({ result: [], ori: [...filePathes] }));
      // Flimi.AppBase().logManager.log(res);
      // return res;
    },
  },
});

export default {};
