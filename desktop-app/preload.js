const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  repositionWindow: (position) => ipcRenderer.send('reposition-window', position),
  toggleExpandSettings: (isOpen) => ipcRenderer.send('toggle-expand-settings', isOpen),
  closeApp: () => ipcRenderer.send('close-app'),
});
