
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
// eslint-disable-next-line consistent-return
exports.main = async (event) => {
  const { openId } = event;
  try {
    const _ = db.command;
    return db.collection('user_posts').where({
      _openid: openId,
      isRemoved: _.or([_.exists(false), _.eq(false)]),
    })
      .orderBy('createdAt', 'desc')
      .get()
      .then(res => res.data);
  } catch (e) {
    console.error(e);
  }
};
