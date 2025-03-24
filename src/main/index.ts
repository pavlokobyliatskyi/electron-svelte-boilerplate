import { BrowserWindow, app, ipcMain } from 'electron';

import { join } from 'node:path';

app.commandLine.appendSwitch('log-level', '3');

const isProduction = process.env.NODE_ENV === 'production';

let mainWindow: BrowserWindow | null;

const iconPath = isProduction
  ? join(__dirname, '../../assets/icon.png')
  : 'public/assets/icon.png';

function createWindow(): void {
  mainWindow = new BrowserWindow({
    show: false,
    height: 300,
    width: 300,
    icon: iconPath,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      devTools: !isProduction,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      allowRunningInsecureContent: false,
      webSecurity: true,
    },
  });

  if (isProduction) {
    mainWindow.loadFile(join(__dirname, '../../index.html'));
  } else {
    mainWindow.loadURL('http://localhost:3000');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (isProduction) {
    mainWindow.setMenu(null);
  }

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      return;
    }

    mainWindow.show();
  });
}

ipcMain.on('get-version', (event) => {
  event.reply('get-version', {
    version: app.getVersion(),
  });
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
