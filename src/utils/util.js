import settings from '../Settings';

export const formatNumber = n => {
  const m = n.toString();
  return m[1] ? m : `0${m}`;
};

export const formatTime = date => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return `${[month, day].map(formatNumber).join('-')} ${[hour, minute]
    .map(formatNumber)
    .join(':')}`;
};

export const formatDate = date => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${[month, day].map(formatNumber).join('-')}`;
};

export const formatDateChinese = date => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${month}月${day}日`;
};

export const formatImage = (url, format) => {
  if (url.indexOf(settings.OSS_IMAGE_FORMAT) > 0) {
    return url + format;
  }
  if (url.indexOf(settings.COMPANY_NAME_CHINA) > 0 || url.indexOf(settings.COMPANY_NAME) > 0) {
    return `${url}?${settings.OSS_IMAGE_FORMAT_JPG}${format}`;
  }
  return url;
};

export const toHttps = url => {
  if (url) {
    if (url.indexOf('https') >= 0) {
      return url;
    }
    if (url.indexOf('http') >= 0) {
      return url.replace('http', 'https');
    }
  }
  return null;
};

export const equal = (value1, value2, precision) => {
  if (value1 + precision > value2 && value1 - precision < value2) {
    return true;
  }
  return false;
};

export const seconds2Timer = seconds => [parseInt(seconds / 60, 10), seconds % 60].map(formatNumber).join(':');

// module.exports = {
//   formatTime,
//   formatDate,
//   formatDateChinese,

//   formatImage,
// };
