const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  });

  //as first page
  win.loadFile('frontpage.html')

  win.webContents.openDevTools();
}


app.whenReady().then(() => {
  createWindow();
});