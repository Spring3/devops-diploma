const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

class App {
  constructor(config) {
    this.mainScreen = null;
    this.windowConfig = config;

    this.init = this.init.bind(this);
  }

  init() {
    this.mainScreen = new BrowserWindow(this.windowConfig);
    this.mainScreen.loadURL(url.format({
      pathname: path.join(__dirname, './app/index.html'),
      protocol: 'file:',
      slashes: true
    }));

    if (process.env.NODE_ENV !== 'produciton') {
      this.mainScreen.webContents.openDevTools();
    }

    this.mainScreen.on('closed', () => {
      delete this.mainScreen;
    });
  }
}

const Riptide = new App({ width: 800, height: 600 });

app.on('ready', Riptide.init);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (Riptide.mainScreen === null) {
    Riptide.init();
  }
});
