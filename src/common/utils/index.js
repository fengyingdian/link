const app = getApp();

export const getUserId = () => {
  if (app.globalData.userInfo) {
    return app.globalData.userInfo.id;
  }
  return '';
};

export default {};
