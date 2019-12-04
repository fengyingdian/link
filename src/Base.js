import LogManager from './LogManager';
import Storage from './Storage';

export default class AppBase {
  // Log
  logManager = new LogManager();

  // Storage
  storage = new Storage();

  // env
  env = wx.getSystemInfoSync();

  // Usage Tracking
  constructor() {
    global.AppBase = () => this;
  }

  // initialization after instance has been created
  initialize = () => {
    this.storage.hydrate();
  };
}
