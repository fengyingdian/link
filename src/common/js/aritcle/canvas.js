/*
 * File: canvas.js
 * File Created: Thursday, 14th March 2019 11:04:48 pm
 * Author: Break <fengyingdian@126.com>
 */

import {
  isOverFlow,
  isOverFlowDoubleLine,
  getContentLineArray,
  drawTextLines,
  getImageCenterZone,
  drawRoundImage,
} from '../../../utils/canvas';

/**
 *
 * @param {*} ops
 */
export const drawShareCover = ({
  ctx, nickname, description, comment, avatar, bkImage,
}) => {
  const canvasW = 500;
  const canvasH = 400;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvasW, canvasH);

  // set the font parameters
  ctx.fillStyle = '#444';
  ctx.font = 'normal normal 29px sans-serif';
  ctx.setTextAlign('left');
  ctx.setTextBaseline('bottom');

  // init bkImage's height, we will use it later
  // 500/210 = 2.38

  // avatar.width = avatar.height = 32 * 2.38 ~= 76
  // 9  * 2.38 ~= 21 6  * 2.38 ~= 14
  // 17 * 2.38 ~= 40 12 * 2.38 ~= 29
  // 20 * 2.38 ~= 48 14 * 2.38 ~= 33

  let bkImageHeight = 398 - 21 - 48 - 40 - 14 - 40;

  // leftPadding left
  let leftPadding = 0;

  // width limit
  let limit = 470;

  // comment's length
  const { length } = comment;

  //
  const formtted = (() => comment.replace(/\r\n/g, '').replace(/\n/g, ''))();

  // if comment length is 0
  if (length < 1 || formtted === '分享了文章' || formtted === '推荐了文章') {
    ctx.fillText('也推荐了这篇文章', leftPadding, 398);
  } else {
    const { i, j } = isOverFlowDoubleLine(formtted, limit, ctx);
    if (i === 0) {
      ctx.fillText(formtted, leftPadding, 398);
    } else {
      ctx.fillText(formtted.slice(0, i), leftPadding, 358);
      if (j < length) {
        ctx.fillText(`${formtted.slice(i, j)}...`, leftPadding, 398);
      } else {
        ctx.fillText(formtted.slice(i, j), leftPadding, 398);
      }
      bkImageHeight -= 40;
    }
  }

  // leftPadding left
  leftPadding = 93;

  // width limit
  limit = 470 - leftPadding;

  // fill user desc
  ctx.fillStyle = '#999';
  let sub = isOverFlow(description, limit, ctx);
  if (sub < description.length) {
    ctx.fillText(`${description.slice(0, sub)}...`, leftPadding, bkImageHeight + 109);
  } else {
    ctx.fillText(description, leftPadding, bkImageHeight + 109);
  }
  // fill user name
  ctx.fillStyle = '#444';
  ctx.font = 'normal bold 33px sans-serif';
  sub = isOverFlow(nickname, limit, ctx);
  if (sub < nickname.length) {
    ctx.fillText(`${nickname.slice(0, sub)}...`, leftPadding, bkImageHeight + 69);
  } else {
    ctx.fillText(nickname, leftPadding, bkImageHeight + 69);
  }

  // draw back ground image
  const bkResult = getImageCenterZone(canvasW, bkImageHeight, bkImage.width, bkImage.height);
  if (bkResult) {
    const {
      sx, sy, sWidth, sHeight,
    } = bkResult;
    ctx.drawImage(bkImage.path, sx, sy, sWidth, sHeight, 0, 0, canvasW, bkImageHeight);
  }

  // calculate and draw avatar
  drawRoundImage(ctx, avatar, 0, bkImageHeight + 29, 76, 76);

  // final draw
  ctx.draw();
};

/**
 * NOTE
 * the paramers in the function need to be
 * updated with below function drawSharePoster
 * @param {*} ops
 */
export const getPosterHeight = ({ ctx, comment }) => {
  const formatted = (() => comment.replace(/\r\n/g, '').replace(/\n/g, ''))();

  ctx.font = 'lighter lighter 16px sans-serif';
  const { lines } = getContentLineArray(ctx, formatted, 311, 4, 16);

  // this is not scalable
  // but when you don't
  // have any better ideas...
  return 220 + 72 + 56 + 28 + 112 + lines.length * 22;
};

/**
 *
 * @param {*} ops
 */
export const drawSharePoster = ({
  ctx,
  title,
  circle,
  nickname,
  description,
  comment,
  bkImage,
  qrcode,
  canvasHeight,
}) => {
  const canvasW = 375;
  const canvasH = canvasHeight;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvasW, canvasH);

  // set the font parameters
  ctx.setTextAlign('left');
  ctx.setTextBaseline('bottom');

  // draw back ground image
  const topPadding = 220;
  const bkResult = getImageCenterZone(canvasW, topPadding, bkImage.width, bkImage.height);
  if (bkResult) {
    const {
      sx, sy, sWidth, sHeight,
    } = bkResult;
    ctx.drawImage(bkImage.path, sx, sy, sWidth, sHeight, 0, 0, canvasW, topPadding);
  }

  // draw mask
  const grd = ctx.createLinearGradient(0, 0, 0, topPadding);
  grd.addColorStop(0, 'transparent');
  grd.addColorStop(1, 'rgba(0,0,0,0.3)');

  // fill with gradient
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvasW, topPadding);

  // leftPadding left
  let leftPadding = 16;

  // width limit
  let limit = 354;

  //
  const { length } = title;

  ctx.fillStyle = 'white';
  ctx.font = 'normal bold 18px sans-serif';

  // draw title
  const { i, j } = isOverFlowDoubleLine(title, limit, ctx);
  if (i === 0) {
    ctx.fillText(title, leftPadding, topPadding - 16);
  } else {
    ctx.fillText(title.slice(0, i), leftPadding, topPadding - 40);
    if (j < length) {
      ctx.fillText(`${title.slice(i, j - 1)}...`, leftPadding, topPadding - 16);
    } else {
      ctx.fillText(title.slice(i, j), leftPadding, topPadding - 16);
    }
  }

  leftPadding = 32;

  limit = 311;

  // fill commnent header
  ctx.font = 'normal bold 14px sans-serif';
  ctx.fillStyle = '#444';
  let sub = isOverFlow(nickname, limit, ctx);
  if (sub < nickname.length) {
    ctx.fillText(`${nickname.slice(0, sub)}...`, leftPadding, topPadding + 117);
  } else {
    ctx.fillText(nickname, leftPadding, topPadding + 117);
    const { width } = ctx.measureText(nickname);
    const remain = limit - width - 12;
    if (remain > 12) {
      sub = isOverFlow(description, remain, ctx);
      ctx.fillStyle = '#999';
      ctx.font = 'lighter lighter 12px sans-serif';
      if (sub < description.length) {
        ctx.fillText(`${description.slice(0, sub)}...`, leftPadding + width + 8, topPadding + 116);
      } else {
        ctx.fillText(description, leftPadding + width + 12, topPadding + 116);
      }
    }
  }
  ctx.draw(true);

  //
  const formatted = (() => comment.replace(/\r\n/g, '').replace(/\n/g, ''))();

  // fill comment
  ctx.font = 'lighter lighter 16px sans-serif';
  const { lines } = getContentLineArray(ctx, formatted, limit, 4, 16);
  drawTextLines(ctx, lines, leftPadding, topPadding + 147, 16, 22, '#444');

  // draw rect border
  leftPadding = 16;
  const rectBorderHeight = 56 + 28 + lines.length * 22;
  ctx.strokeStyle = '#d8d8d8';
  ctx.strokeRect(leftPadding, topPadding + 72, canvasW - 2 * leftPadding, rectBorderHeight);

  // draw quotes
  // 51 - 27 = 24
  ctx.drawImage('/assets/icons/quotes.png', 25, topPadding + 51, 52, 36);

  // 圈子
  if (circle) {
    const circleBasePadding = 20;
    const circleRadius = 16;
    ctx.save();
    ctx.font = 'lighter lighter 13px sans-serif';
    ctx.fillStyle = 'rgb(225, 40, 40)';
    const { width } = ctx.measureText(circle);
    const roundCenter = canvasW - width - 2 * circleRadius;
    ctx.rect(
      roundCenter,
      topPadding + circleBasePadding,
      width + 2 * circleRadius,
      2 * circleRadius,
    );
    ctx.fill();
    ctx.arc(
      roundCenter,
      topPadding + circleBasePadding + circleRadius,
      circleRadius,
      0,
      2 * Math.PI,
    );
    ctx.fill();
    drawRoundImage(
      ctx,
      '/assets/icons/circle2.png',
      roundCenter - 8,
      topPadding + circleBasePadding + 7,
      circleRadius,
    );
    ctx.restore();
    ctx.font = 'lighter lighter 13px sans-serif';
    ctx.setTextAlign('right');
    ctx.fillStyle = '#fff';
    ctx.fillText(circle, 359, topPadding + circleBasePadding + 23);
    ctx.fillStyle = '#999';
    ctx.fillText('来自小馆', roundCenter - 22, topPadding + circleBasePadding + 23);
  }

  // 绘制虚线
  // ctx.setLineCap('butt');
  // ctx.setStrokeStyle('rgb(216, 216, 216)');
  // ctx.setLineDash([10, 2], 100);
  // ctx.beginPath();
  // ctx.moveTo(0, 422);
  // ctx.lineTo(canvasW, 422);
  // ctx.stroke();

  //
  ctx.fillStyle = '#999';
  ctx.setTextAlign('left');
  ctx.font = 'lighter lighter 12px sans-serif';
  ctx.fillText('长按小程序码查看详情', 167, topPadding + rectBorderHeight + 72 + 52);
  ctx.fillText(`红板报·${wx.env.navigationBarTitle}`, 167, topPadding + rectBorderHeight + 72 + 72);

  // draw qrcode
  leftPadding = 16;
  ctx.drawImage(qrcode, 87, topPadding + rectBorderHeight + 72 + 24, 64, 64);
  return ctx.draw(true);
};

export const drawUserShareCover = ({ ctx, title, comment }) => {
  const canvasW = 500;
  const canvasH = 400;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvasW, canvasH);

  // width limit
  const limit = 460;

  // draw mask
  const grd = ctx.createLinearGradient(0, 0, 0, canvasH);
  grd.addColorStop(0, 'rgba(240,40,40,0.2)');
  grd.addColorStop(1, 'transparent');

  // fill with gradient
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvasW, canvasH);

  // ctx.drawImage('/assets/temp/sharebg.png', 0, 0, 500, 260, 0, 0, canvasW, canvasH);

  // set the font parameters
  ctx.setTextAlign('left');
  ctx.setTextBaseline('bottom');

  // leftPadding left
  const leftPadding = 24;

  // get title's lines
  let formatted = (() => title.replace(/\r\n/g, '').replace(/\n/g, ''))();
  const { lines: titles } = getContentLineArray(ctx, formatted, limit, 2, 40);

  const topPadding = 30;
  const titleLineHeight = 60;

  // draw title
  ctx.fillStyle = '#444';
  ctx.font = 'normal bolder 40px sans-serif';
  drawTextLines(ctx, titles, leftPadding, topPadding + 40, 40, 58, '#444');

  // fill comment
  ctx.font = 'lighter lighter 32px sans-serif';
  formatted = (() => comment.replace(/\r\n/g, '').replace(/\n/g, ''))();
  const { lines: comments } = getContentLineArray(ctx, formatted, limit, 4, 32);
  drawTextLines(
    ctx,
    comments,
    leftPadding,
    titles.length * titleLineHeight + topPadding + 32 + 30,
    32,
    48,
    '#999',
  );
  ctx.draw();
};
