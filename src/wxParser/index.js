/**
 * 主解析函数
 * @param  {Object}   options                             配置参数
 * @param  {String}   [options.bind=wxParserData]         绑定的变量名
 * @param  {String}   options.html                        HTML 内容
 * @param  {Object}   options.target                      要绑定的模块对象
 * @param  {Boolean}  [options.enablePreviewImage=true]   是否启用预览图片功能
 * @param  {Function} [options.tapLink]                   点击超链接后的回调函数
 */
const parse = ({
  bind = 'wxParserData', html, target, enablePreviewImage = true, tapLink,
}) => {
  if (Object.prototype.toString.call(html) !== '[object Object]') {
    throw new Error('HTML 内容必须是字符串');
  }
  const that = target;

  const bindData = {};
  bindData[bind] = html;

  that.setData(bindData);

  // load image successfully
  that.onWxParserImageSuccess = (opts) => {
    Flimi.AppBase().logManager.log('success', opts.detail);
  };

  // load image failed
  that.onWxParserImageError = (opts) => {
    Flimi.AppBase().logManager.log('error', opts.detail.errMsg);
  };

  // tap the image
  that.onWxParserImage = (opts) => {
    if (!enablePreviewImage) {
      return;
    }
    wx.previewImage({
      current: opts.target.dataset.src,
      urls: that.data.content.imageUrls,
    });
  };

  // tap link
  if (Object.prototype.toString.call(tapLink) === '[object Function]') {
    that.tapWxParserA = (e) => {
      const { href } = e.currentTarget.dataset;
      tapLink(href);
    };
  }
};

module.exports = {
  parse,
};
