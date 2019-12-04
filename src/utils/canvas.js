/**
 *
 * @param {*} content
 * @param {*} limit
 * @param {*} ctx
 */
export const isOverFlow = (content, limit, ctx) => {
  const { length } = content;
  let i = 0;
  for (; i < length; i += 1) {
    const { width } = ctx.measureText(content.slice(0, i + 1));
    if (width > limit) {
      break;
    }
  }
  return i;
};

/**
 *
 * @param {*} content
 * @param {*} limit
 * @param {*} ctx
 */
export const isOverFlowDoubleLine = (content, limit, ctx) => {
  // fill comment body
  let i = 0;
  let j = 0;
  const { length } = content;
  while (j < length) {
    j += 1;
    const { width } = ctx.measureText(content.slice(i, j));
    if (width > limit) {
      j -= 1;
      if (i === 0) {
        i = j;
      } else {
        break;
      }
    }
  }

  return {
    i,
    j,
  };
};

/**
 *
 * @param {*} ctx
 * @param {*} content
 * @param {*} oneLineWidth
 * @param {*} lineCountLimit
 * @param {*} fontSize
 */
export const getContentLineArray = (
  ctx,
  content,
  oneLineWidth = 311,
  lineCountLimit = 5,
  fontSize = 14,
) => {
  ctx.save();
  ctx.font = `normal normal ${fontSize}px sans-serif`;
  // convert string to array
  const contentArray = Array.from(content);
  const result = contentArray.reduce(
    ({ lines, curLine, rest }) => {
      let temp = curLine;
      if (lines.length < lineCountLimit) {
        const char = rest.shift();
        temp.push(char);
        const { width } = ctx.measureText(temp.join(''));
        if (width > oneLineWidth) {
          temp.pop();
          if (lines.length === lineCountLimit - 1) {
            const lastLine = `${temp.slice(0, temp.length - 1).join('')}...`;
            lines.push(lastLine);
          } else {
            lines.push(temp.join(''));
            temp = [char];
          }
        } else if (rest.length === 0) {
          lines.push(temp.join(''));
        }
      }
      return {
        lines,
        curLine: temp,
        rest,
      };
    },
    { lines: [], curLine: [], rest: [...contentArray] },
  );
  ctx.restore();
  return result;
};

/**
 *
 * @param {*} ctx
 * @param {*} textLines
 * @param {*} coorX
 * @param {*} coorY
 * @param {*} fontSize
 * @param {*} lineHeight
 * @param {*} color
 */
export const drawTextLines = (
  ctx,
  textLines,
  coorX,
  coorY,
  fontSize = 14,
  lineHeight = 20,
  color = '#999',
) => {
  ctx.save();
  ctx.font = `normal normal ${fontSize}px sans-serif`;
  ctx.fillStyle = color;

  const { y: lastY } = textLines.reduce(
    ({ y, rest }) => {
      const line = rest.shift();
      ctx.fillText(line, coorX, y);
      return {
        y: y + lineHeight,
        rest,
      };
    },
    { y: coorY, rest: [...textLines] },
  );
  ctx.restore();
  return lastY;
};

/**
 *
 * @param {*} canvasWidth
 * @param {*} canvasHeight
 * @param {*} imageWidth
 * @param {*} imageHeight
 * @param {*} limit
 */
export const getImageCenterZone = (
  canvasWidth,
  canvasHeight,
  imageWidth,
  imageHeight,
  limit = 10,
) => {
  if (Math.min(canvasWidth, canvasWidth, imageWidth, imageHeight) < limit) {
    return null;
  }

  const imageRatio = imageWidth / imageHeight;
  const canvasRatio = canvasWidth / canvasHeight;

  // image is wider than canvas
  // cut off overflow width
  if (imageRatio > canvasRatio) {
    const sWidth = imageHeight * canvasRatio;
    const sx = (imageWidth - sWidth) / 2;
    return {
      sx,
      sy: 0,
      sWidth,
      sHeight: imageHeight,
    };
  }

  // image is heigher than canvas
  // cut off overflow height
  const sHeight = imageWidth / canvasRatio;
  const sy = (imageHeight - sHeight) / 2;
  return {
    sx: 0,
    sy,
    sWidth: imageWidth,
    sHeight,
  };
};

/**
 *
 * @param {*} ctx
 * @param {*} imageSrc
 * @param {*} avatarX
 * @param {*} avatarY
 * @param {*} diameter
 */
export const drawRoundImage = (ctx, imageSrc, avatarX, avatarY, diameter) => {
  ctx.beginPath();
  ctx.arc(diameter / 2 + avatarX, diameter / 2 + avatarY, diameter / 2, 0, Math.PI * 2, false);
  ctx.clip();
  ctx.drawImage(imageSrc, avatarX, avatarY, diameter, diameter);
};
