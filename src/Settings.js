// NOTE
// I can find no more convenient way
// to set navigationBarTitleText add to get it
// because wx only provide the wx.setNavigationBarTitle
// but no wx.getNavigationBarTile api here
wx.env.navigationBarTitle = '圈里圈外';

// check if customer's device is iphone X or newer model
wx.isIphoneX = () => {
  if (wx.getSystemInfoSync().model.indexOf('iPhone X') === 0) {
    return true;
  }
  return false;
};

// App Settings and Constants
const settings = {
  // file storage position
  STORAGE_FILE_PATH: './storage/index.json',

  // print log info to console
  DISABLE_LOG_TO_CONSOLE: false,
  CONSOLE_LOG_HEADER: '[DEV]',
  CONSOLE_LOG_LEVEL: 'info',
  CONSOLE_LOG_HEADER_STYLE: 'color: rgb(0, 178, 106); font-style: bold;',

  //
  LAUNCH_COUNT: 'launch_count',

  COMPANY_NAME: 'flipboard',
  COMPANY_NAME_CHINA: 'flipchina',

  OSS_IMAGE_FORMAT: 'x-oss-process=image/format',
  OSS_IMAGE_FORMAT_JPG: 'x-oss-process=image/format,jpg',
  OSS_IMAGE_FORMAT_WEBP: 'x-oss-process=image/format,webp',
};

export default settings;
