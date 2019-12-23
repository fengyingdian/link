// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async () => {
  const {
    OPENID,
    APPID,
    UNIONID,
    ENV,
  } = cloud.getWXContext();

  return {
    OPENID,
    APPID,
    UNIONID,
    ENV,
  };
};
