import { getImageInfo, canvasToTempFilePath } from '../../service/wxpromisify';
import {
  drawShareCover, drawUserShareCover, drawSharePoster, getPosterHeight,
} from '../../common/js/aritcle/canvas';


export const userStatusDrawBehavior = Behavior({
  behaviors: [],
  properties:
  {
    statusId: {
      type: String,
      value: '',
      observer(newValue) {
        if (newValue) {
          this.init(newValue);
        }
      },
    },
    comment: {
      type: Object,
      value: {},
    },
    comments: {
      type: Array,
      value: [],
    },
    article: {
      type: Object,
      value: {},
    },
    hashtag: {
      type: Object,
      value: {},
    },
  },
  data: {
  },
  attached() {
  },
  onReady() {
  },
  methods: {
    getHttpsUrl(image) {
      if (image) {
        if (image.indexOf('https') >= 0) {
          return image;
        }
        if (image.indexOf('http') >= 0) {
          return image.replace('http', 'https');
        }
      }
      return '';
    },

    downloadImageCover(image) {
      return getImageInfo({ src: this.getHttpsUrl(image) })
        .catch((res) => {
          Flimi.AppBase().logManager.log('download bkImage fail', res);
          return {
            path: '/assets/temp/bg.jpg',
            width: 1200,
            height: 800,
          };
        });
    },

    downloadImageAvatar(image) {
      return getImageInfo({ src: this.getHttpsUrl(image) })
        .catch((res) => {
          Flimi.AppBase().logManager.log('download avatar fail', res);
          return {
            path: '/assets/temp/user.png',
            width: 100,
            height: 100,
          };
        });
    },

    downloadImageQRcode(statusId) {
      return getImageInfo({ src: `https://s.flipboard.cn/influencer/wxcode/userstatuses/${statusId}` })
        .catch((res) => {
          Flimi.AppBase().logManager.log('download qrcode fail', res);
          return {
            path: '/assets/temp/QRCode.jpg',
          };
        });
    },

    getImageQRcode(statusId) {
      const that = this;
      const { localQRcodePath = '' } = that.data;
      if (localQRcodePath) {
        return localQRcodePath;
      }
      return that.downloadImageQRcode(statusId)
        .then(res => {
          const { path = '' } = res || {};
          that.setData({ localQRcodePath: path });
          return path;
        });
    },

    getImageCover(src) {
      const that = this;
      const { localBkImge = '' } = that.data;
      if (localBkImge) {
        return localBkImge;
      }
      return that.downloadImageCover(src)
        .then(res => {
          that.setData({ localBkImge: res });
          return res;
        });
    },

    // userAvatar: [
    //   {
    //     userid,
    //     avatar,
    //   }
    // ]
    getImageAvatar(userid, src) {
      const that = this;
      const { userAvatars = [] } = that.data;
      const avatars = userAvatars.filter((user) => user.userid === userid);
      if (avatars && avatars.length > 0) {
        return avatars[0];
      }
      return that.downloadImageAvatar(src)
        .then(avatar => {
          userAvatars.push({
            userid,
            avatar,
          });
          this.setData({ userAvatars, tempAvatar: avatar.path });
          return avatar;
        });
    },

    drawCover(userComment, article) {
      const that = this;
      const {
        displayName: nickname, description, introduction, content: comment, userid, imageUrl,
      } = userComment;
      const { image = '' } = article;
      return that.getImageCover(image)
        .then(() => that.getImageAvatar(userid, imageUrl))
        .then(() => {
          const { localBkImge: bkImage = '', tempAvatar: avatar } = that.data;
          return drawShareCover({
            nickname,
            description: introduction || description,
            comment,
            ctx: wx.createCanvasContext('cover'),
            // for back ground image
            // we need it's path/width/height
            // to fit it's size to escape shrink
            bkImage,
            // for avatar because it's size
            // is constant and squared
            // we just need it's path
            avatar,
          });
        })
        .then(() => setTimeout(
          () => canvasToTempFilePath({
            canvasId: 'cover',
            fileType: 'jpg',
          })
            .then(({ tempFilePath }) => that.setData({
              imageUrl: tempFilePath,
            })),
          200,
        ))
        .catch(res => Flimi.AppBase().logManager.log('draw cover fail', res));
    },

    drawUserCover(comment) {
      const that = this;
      drawUserShareCover({
        title: that.data.article.title,
        ctx: wx.createCanvasContext('cover'),
        comment: `${comment.authorDisplayName}：${comment.text}`,
      });
      setTimeout(() => {
        canvasToTempFilePath({ canvasId: 'cover', fileType: 'jpg' })
          .then(({ tempFilePath }) => that.setData({
            shareUrl: tempFilePath,
          }));
      }, 100);
    },

    drawPoster({
      comment, nickname, description, circle = '', statusId = '',
    }) {
      const that = this;
      return Promise.resolve()
        .then(() => {
          const posterHeight = getPosterHeight({
            comment,
            ctx: wx.createCanvasContext('getPosterHeight'),
          });
          this.setData({
            posterHeight,
          });
        })
        .then(() => that.getImageCover())
        .then(() => that.getImageQRcode(statusId))
        .then(() => drawSharePoster({
          circle,
          nickname,
          comment,
          description,
          canvasHeight: that.data.posterHeight,
          ctx: wx.createCanvasContext('poster'),
          title: that.data.article.title,
          // circle: that.data.article.circles[0].name,
          // for back ground image
          // we need it's path/width/height
          // to fit it's size to escape shrink
          bkImage: that.data.localBkImge,
          // for qrcode because it's size
          // is constant and squared
          // we just need it's path
          qrcode: that.data.localQRcodePath,
        }))
        .then(() => setTimeout(() => {
          canvasToTempFilePath({
            canvasId: 'poster',
            fileType: 'jpg',
          })
            .catch(() => {
              Flimi.AppBase().logManager.log('draw poster fail');
            })
            .then(({ tempFilePath }) => {
              Flimi.AppBase().logManager.log('draw poster: ', tempFilePath);
              that.setData({
                posterUrl: tempFilePath,
              });
            });
        }, 200))
        .catch(res => Flimi.AppBase().logManager.log('draw poster fail', res))
        .then(
          () => setTimeout(() => {
            wx.hideLoading();
            this.setData({
              isShowPosterView: true,
            });
          }),
          500,
        );
    },
  },
});

export default {};
