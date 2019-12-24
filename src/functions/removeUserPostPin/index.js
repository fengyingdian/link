
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
// eslint-disable-next-line consistent-return
exports.main = async (event) => {
  const { openId = '', postId } = event;
  try {
    return db.collection('user_post_pins').where({
      _openid: openId,
      postId,
    }).remove();
  } catch (e) {
    console.error(e);
  }
};
