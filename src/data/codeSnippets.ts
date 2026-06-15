export interface CodeFile {
  name: string;
  path: string;
  language: string;
  description: string;
  code: string;
}

export const electronSnippets: CodeFile[] = [
  {
    name: "main.ts",
    path: "electron/main.ts",
    language: "typescript",
    description: "Electron 应用入口。配置透明窗体、取消边框和置顶显示，挂载 IPC 加载保存本地配置等。",
    code: `import { app, BrowserWindow, screen, ipcMain } from 'electron';
import path from 'path';
import Store from 'electron-store';

const store = new Store({
  defaults: {
    autoHide: true,
    waterIntervalMinutes: 30,
    lastWaterAt: Date.now(),
    nextWaterAt: Date.now() + 30 * 60 * 1000,
    opacity: 0.95,
    enableAnimation: true,
  },
});

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  const { width } = screen.getPrimaryDisplay().workAreaSize;
  const barWidth = Math.min(Math.max(width * 0.25, 420), 680);
  const barHeight = 48; // 预留阴影和起跳动画高度

  mainWindow = new BrowserWindow({
    width: barWidth,
    height: barHeight,
    x: Math.round((width - barWidth) / 2),
    y: 0,
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    focusable: false, // 不抢占输入焦点
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // 始终在最上层
  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  mainWindow.setVisibleOnAllWorkspaces(true);

  // 加载页面
  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  } else {
    mainWindow.loadURL('http://localhost:3000');
  }

  // 鼠标靠近顶部检测 (TOP_TRIGGER_HEIGHT = 4px)
  setInterval(() => {
    if (!mainWindow) return;
    const point = screen.getCursorScreenPoint();
    const bounds = mainWindow.getBounds();
    
    // 是否在此状态栏水平区域上方
    const isOverBarX = point.x >= bounds.x && point.x <= bounds.x + bounds.width;
    const isNearTop = point.y <= 4 || (isOverBarX && point.y <= bounds.y + bounds.height);
    
    mainWindow.webContents.send('mouse-near-top-change', isNearTop);
  }, 100);
}

// IPC 接口绑定
ipcMain.handle('load-config', () => {
  return store.store;
});

ipcMain.handle('save-config', (_, config) => {
  Object.entries(config).forEach(([key, value]) => {
    store.set(key, value);
  });
});

app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});`
  },
  {
    name: "preload.ts",
    path: "electron/preload.ts",
    language: "typescript",
    description: "隔离的主进程 IPC Bridge 连接线。使 React 渲染进程能安全获取全局鼠标事件和配置存储。",
    code: `import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('statusbarAPI', {
  // 订阅鼠标移入移出事件
  onMouseNearTopChange: (callback: (isNearTop: boolean) => void) => {
    ipcRenderer.on('mouse-near-top-change', (_, value) => callback(value));
  },

  // 本地持久化配置保存
  saveConfig: (config: Record<string, any>) => {
    ipcRenderer.invoke('save-config', config);
  },

  // 本地配置拉取
  loadConfig: () => {
    return ipcRenderer.invoke('load-config');
  },
});`
  },
  {
    name: "package.json spec",
    path: "package.json (Electron setup)",
    language: "json",
    description: "配套完整的启动、连缀热重载及最终打包等 script 配置信息指南。",
    code: `{
  "name": "codex-water-statusbar",
  "version": "1.0.0",
  "main": "dist-electron/main.js",
  "scripts": {
    "dev": "vite",
    "electron:dev": "concurrently \\"npm run dev\\" \\"wait-on http://localhost:3000 && tsc -p electron && electron .\\"",
    "build": "tsc && vite build && tsc -p electron",
    "pack": "electron-builder"
  },
  "dependencies": {
    "electron-store": "^8.1.0",
    "framer-motion": "^11.5.4",
    "lucide-react": "^0.436.0",
    "react": "^18.3.1",
    "zustand": "^4.5.5"
  },
  "devDependencies": {
    "electron": "^31.4.0",
    "electron-builder": "^24.13.3",
    "concurrently": "^8.2.2",
    "wait-on": "^7.2.0"
  }
}`
  }
];
