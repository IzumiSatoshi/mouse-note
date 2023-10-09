const {app, BrowserWindow} = require('electron');
const path = require('node:path');
const isMac = process.platform === 'darwin'

const { initialize, enable } = require('@electron/remote/main');
initialize();



function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "Mouse Note",
    width : 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // preload: path.join(__dirname, 'preload.js')
    }
  });

  enable(mainWindow.webContents);
  mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}


app.whenReady().then(() => {
  createMainWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) { 
      createMainWindow();
    }
  })
})



app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})