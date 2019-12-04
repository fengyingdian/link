import Settings from './Settings';

// Manage Storage
export default class Storage {
  wxfs = wx.getFileSystemManager();

  fileStorage = null;

  mem = {};

  mGet = (key) => this.mem[key];

  mSet = (key, val) => {
    this.mem[key] = val;
  };

  hydrate = () => {
    if (this.fileStorage === null) {
      try {
        const file = this.wxfs.readFileSync(Settings.STORAGE_FILE_PATH, 'utf8');
        this.fileStorage = JSON.parse(Buffer.from(file));
      } catch (err) {
        this.fileStorage = {};
        // Flimi.AppBase().logManager.warn(`storage hydrate error:${err.message}`);
      }
    }
    return this.fileStorage;
  };

  serialize = () => {
    try {
      const str = JSON.stringify({
        ...this.fileStorage,
        v: Date.now(),
      });
      this.wxfs.writeFileSync(Settings.STORAGE_FILE_PATH, str, 'utf8');
    } catch (err) {
      Flimi.AppBase().logManager.warn(`storage serialize error:${err.message}`);
    }
  };
}
