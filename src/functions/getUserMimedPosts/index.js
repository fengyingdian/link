
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
// eslint-disable-next-line consistent-return
exports.main = async (event) => {
  const { openId } = event;
  try {
    const postFlags = new Set([]);
    const posts = [];
    await db.collection('user_post_mimes').where({
      _openid: openId,
    }).get()
      .then((res) => {
        if (res && res.data && res.data.length > 0) {
          const { data } = res;
          // eslint-disable-next-line array-callback-return
          data.map(item => {
            if (postFlags.has(item.postId)) {
              posts.map(({ postId, mimes }) => {
                if (postId) {
                  mimes.push({ ...item });
                }
                return {
                  postId,
                  mimes,
                };
              });
            } else {
              postFlags.add(item.postId);
              posts.push({
                postId: item.postId,
                mimes: [
                  {
                    ...item,
                  },
                ],
              });
            }
          });
        }
      });
    const _ = db.command;
    const result = await Promise.all(posts.map(({ postId, mimes }) => db.collection('user_posts').where({
      _id: postId,
      isRemoved: _.or([_.exists(false), _.eq(false)]),
    })
      .get()
      // eslint-disable-next-line consistent-return
      .then((res) => {
        if (res && res.data && res.data.length > 0) {
          return {
            ...res.data[0],
            mimes,
          };
        }
        return {};
      })));
    return result.filter(({ mimes = [] }) => mimes.length > 0);
  } catch (e) {
    console.error(e);
  }
};
