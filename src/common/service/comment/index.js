import { fetchArticleComment } from '../../../service/api';
import { getUserId } from '../../utils/index';
import { formatImage, formatTime } from '../../../utils/util';

export const getAvatar = (authorImage) => {
  if (authorImage && authorImage.smallURL) {
    return formatImage(authorImage.smallURL, '/resize,w_100/quality,q_80');
  }
  return '/assets/temp/user.png';
};

export const getReplyTo = (replyId, replyAuthor) => {
  if (replyId) {
    const { authorDisplayName } = replyAuthor;
    return `回复 ${authorDisplayName}: `;
  }
  return '';
};

export const getFormatComment = (comment, text) => {
  const {
    dateCreated, authorImage, replyAuthor, replyId,
  } = comment;
  const avatar = getAvatar(authorImage);
  const time = formatTime(new Date(dateCreated));
  const replyTo = getReplyTo(replyId, replyAuthor);
  return {
    ...comment,
    avatar,
    time,
    replyTo,
    text,
  };
};

export const getArticleComment = ({ url = '' }) => {
  const userId = getUserId();
  return fetchArticleComment({
    url,
    userId,
  })
    .then((res) => {
      if (res.data.status !== 0) {
        wx.showToast({
          icon: 'none',
          title: '读取评论数据失败',
        });
        return;
      }
      const {
        data: { comments },
      } = res.data;
      // eslint-disable-next-line consistent-return
      return comments.map((element) => {
        const text = element.text.replace(/[\r\n]/g, '').replace(/(^\s*)|(\s*$)/g, '');
        return getFormatComment(element, text);
      });
    })
    .catch((res) => {
      Flimi.AppBase().logManager.log('fetch article comments error: ', res);
    });
};

export default {};
