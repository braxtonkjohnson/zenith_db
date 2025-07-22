const { app, BrowserWindow, Tray } = require('electron');
const path = require('path'); 

let tray = null; 

const isDev = !app.isPackaged; 

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:5173'); // Vite dev server
  } else {
    win.loadFile(path.join(__dirname, 'client/dist/index.html'));
  }
}

app.whenReady().then(() => {
  // Set up tray icon
  const iconPath = path.join(__dirname, 'assets/zenith.png');
  tray = new Tray(iconPath);
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
}); 