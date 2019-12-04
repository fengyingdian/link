import { getImageInfo, canvasToTempFilePath } from '../../../service/wxpromisify';
import { formatImage } from '../../../utils/util';
import {
  drawShareCover, drawUserShareCover, drawSharePoster, getPosterHeight,
} from './canvas';

const getInfluencerAvatar = (influencer) => {
  if (influencer) {
    const { avatar: image } = influencer;
    if (image.indexOf('https') >= 0) {
      return image;
    }
    if (image.indexOf('http') >= 0) {
      return image.replace('http', 'https');
    }
  }
  return 'https://s.flipchina.cn/influencer/avatars/user.png';
};

function drawCover() {
  const that = this;
  const avatar = getInfluencerAvatar(that.data.influencer);
  return Promise.resolve()
    .then(() => {
      if (!that.data.localBkImge) {
        const src = formatImage(that.data.article.cover, '/resize,w_400/quality,q_90');
        return getImageInfo({ src });
      }
      return that.data.localBkImge;
    })
    .catch((res) => {
      Flimi.AppBase().logManager.log('download bkImage fail', res);
      return {
        path: '/assets/temp/bg.jpg',
        widhth: 1200,
        height: 800,
      };
    })
    .then(localBkImge => that.setData({ localBkImge }))
    .then(() => {
      if (!that.data.localAvatarPath) {
        const formattedAvatar = formatImage(avatar, '/resize,w_100/quality,q_80');
        return getImageInfo({ src: formattedAvatar });
      }
      return {
        path: that.data.localAvatarPath,
      };
    })
    .catch((res) => {
      Flimi.AppBase().logManager.log('download avatar fail', res);
      return {
        path: '/assets/temp/user.jpg',
      };
    })
    .then(({ path }) => {
      that.data.localAvatarPath = path;
    })
    .then(() => drawShareCover({
      ...that.data.influencer,
      ctx: wx.createCanvasContext('cover'),
      // for back ground image
      // we need it's path/width/height
      // to fit it's size to escape shrink
      bkImage: that.data.localBkImge,
      // for avatar because it's size
      // is constant and squared
      // we just need it's path
      avatar: that.data.localAvatarPath,
    }))
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
}

function drawUserCover() {
  const that = this;
  const {
    selectedShareItem: { comment },
  } = that.data;
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
}

function drawPoster({ comment, nickname, description }) {
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
    .then(() => {
      if (!that.data.localBkImge) {
        const src = formatImage(that.data.article.cover, '/resize,w_400/quality,q_90');
        return getImageInfo({ src });
      }
      return that.data.localBkImge;
    })
    .catch((res) => {
      Flimi.AppBase().logManager.log('download bkImage fail', res);
      return {
        path: '/assets/temp/bg.jpg',
        widhth: 1200,
        height: 800,
      };
    })
    .then(localBkImge => that.setData({ localBkImge }))
    .then(() => {
      if (!that.data.localQRcodePath) {
        return getImageInfo({
          src: `https://s.flipboard.cn/influencer/wxcode/articles/${that.data.article.id}`,
        });
      }
      return {
        path: that.data.localQRcodePath,
      };
    })
    .catch((res) => {
      Flimi.AppBase().logManager.log('download qrcode fail', res);
      return {
        path: '/assets/temp/QRCode.jpg',
      };
    })
    .then(({ path }) => {
      that.data.localQRcodePath = path;
    })
    .then(() => drawSharePoster({
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
          wx.hideLoading();
        });
    }, 200))
    .catch(res => Flimi.AppBase().logManager.log('draw poster fail', res))
    .then(
      () => setTimeout(() => this.setData({
        isShowPosterView: true,
      })),
      500,
    );
}

export const draw = {
  drawCover,
  drawUserCover,
  drawPoster,
};

export default {};
