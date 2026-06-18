const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  // Initial window size tailored to contain the floating status bar
  // Width: 480px, Height: 60px is perfect for the status bar
  // We can dynamically resize it to 280px height when the settings dropdown is toggled.
  mainWindow = new BrowserWindow({
    width: 480,
    height: 60,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: false,
    focusable: true, // Focus is required to interact with sliders & dropdown inputs
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    // Position it at the bottom-left by default, about 24px from screen boundaries
    x: 24,
    y: screenHeight - 84,
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  mainWindow.setVisibleOnAllWorkspaces(true);

  // Automatically adjust alignment on model request
  ipcMain.on('reposition-window', (event, position) => {
    const activeDisplay = screen.getPrimaryDisplay();
    const { width, height } = activeDisplay.workAreaSize;
    if (position === 'bottom-left') {
      mainWindow.setBounds({ x: 24, y: height - 84, width: 480, height: mainWindow.getBounds().height });
    } else if (position === 'top-center') {
      mainWindow.setBounds({ x: Math.floor((width - 480) / 2), y: 20, width: 480, height: mainWindow.getBounds().height });
    } else if (position === 'top-right') {
      mainWindow.setBounds({ x: width - 504, y: 20, width: 480, height: mainWindow.getBounds().height });
    }
  });

  // Handle setting panel toggling
  ipcMain.on('toggle-expand-settings', (event, isOpen) => {
    const currentBounds = mainWindow.getBounds();
    const targetHeight = isOpen ? 260 : 60;
    
    // Smooth transition, if bottom-left, expand upwards! Otherwise expand downwards
    const yDiff = targetHeight - currentBounds.height;
    const isBotLeft = currentBounds.y > (screenHeight / 2);

    const newY = isBotLeft ? currentBounds.y - yDiff : currentBounds.y;
    mainWindow.setBounds({
      x: currentBounds.x,
      y: newY,
      width: currentBounds.width,
      height: targetHeight,
    });
  });

  // Handle window close
  ipcMain.on('close-app', () => {
    app.quit();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
