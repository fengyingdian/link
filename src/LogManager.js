import Settings from './Settings';

/* eslint no-console: 0 */
const consoleLogger = Settings.DISABLE_LOG_TO_CONSOLE
  ? () => {}
  : console[Settings.CONSOLE_LOG_LEVEL] || console.log;

const header = `%c${Settings.CONSOLE_LOG_HEADER}`;
const style = Settings.CONSOLE_LOG_HEADER_STYLE;

export default class LogManager {
  wxLogManager = wx.getLogManager();

  consoleLogger = console;

  debugEnabled = false;

  setEnableDebug = (enable) => {
    this.wxLogManager.setEnableDebug({
      enableDebug: Boolean(enable),
    });
  };

  log = (...args) => {
    consoleLogger(header, style, ...args);
    this.wxLogManager.log(...args);
  };

  info = (...args) => {
    consoleLogger(header, style, ...args);
    this.wxLogManager.info(...args);
  };

  warn = (...args) => {
    consoleLogger(header, style, ...args);
    this.wxLogManager.warn(...args);
  };

  debug = (...args) => {
    consoleLogger(header, style, ...args);
    this.wxLogManager.debug(...args);
  };
}
