
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
// eslint-disable-next-line consistent-return
exports.main = async (event) => {
  const { openId, userInfo } = event;
  try {
    return await db.collection('wechat_users').where({
      _openid: openId,
    })
      .update({
        data: {
          ...userInfo,
        },
      });
  } catch (e) {
    console.error(e);
  }
};
