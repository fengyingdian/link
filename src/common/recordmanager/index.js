
export const recorderManager = wx.getRecorderManager();

recorderManager.onStart(() => {
  Flimi.AppBase().logManager.log('recorder start');
});

recorderManager.onPause(() => {
  Flimi.AppBase().logManager.log('recorder pause');
});

recorderManager.onStop((res) => {
  Flimi.AppBase().logManager.log('recorder stop', res);
  // const { tempFilePath } = res;
});

recorderManager.onFrameRecorded((res) => {
  const { frameBuffer } = res;
  Flimi.AppBase().logManager.log('frameBuffer.byteLength', frameBuffer.byteLength);
});

export const options = {
  duration: 10000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'aac',
  frameSize: 50,
};

export default {};
