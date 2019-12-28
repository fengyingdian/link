
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
// eslint-disable-next-line consistent-return
exports.main = async (event) => {
  const { mimeId, isRemoved = false } = event;
  try {
    return db.collection('user_post_mimes').where({
      _id: mimeId,
    })
      .update({
        data: {
          isRemoved,
        },
      });
  } catch (e) {
    console.error(e);
  }
};
