/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { timeStamp } from 'console';
import { Gabaryty, Przedzialy } from 'renderer/pages/AddFile';
import FileConversionHandler from './FileConversionHandler';
import WindowSettings from './WindowSettings';
import ReportOperator from './ReportOperator';
import { writeFile } from 'fs';

require('events').EventEmitter.defaultMaxListeners = 15;
const puppeteer = require('puppeteer');
const Store = require('electron-store');
const storage = new Store();
interface ArrayElementType {
  [key: string]: string | number;
}

require('@electron/remote/main').initialize();

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

//ipcMain handlers
const generatePDF= async(html: string) =>{
  return new Promise(async (resolve,reject)=>{
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html);
    await page.emulateMediaType("screen");
    const pdfConfig = {
      format: "A4",
      printBackground: true,
    };
    const pdf = await page.pdf(pdfConfig);
    await browser.close();
    resolve(pdf)
  })
  
}

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.handle('price-list', async (event, arg) => {
  const PriceListArray: Array<Przedzialy | Gabaryty> =
    await FileConversionHandler.handlePriceListConvertion(arg);
  return PriceListArray;
});

ipcMain.handle('file', async (event, arg) => {
  const db = await FileConversionHandler.handleListOfOrdersConvertion(arg);

  return db;
});

ipcMain.handle('download-pdf', async (event, arg) => {
  const PDFBuffer = generatePDF(arg);

  return PDFBuffer;
});
ipcMain.handle('save-file', async (event, arg) => {
  const filePath = await dialog.showSaveDialog(arg.settings);
  
  if (filePath.filePath) {
    writeFile(filePath.filePath, arg.buffer, () => console.log('Zapisałem plik'));
    
  }
  return 'Udało się zapisać plik';
});
ipcMain.handle('download-all-pdf', async (event, arg) => {
  const arrOfBuffers: any[] = [];

  for (const element of arg) {
    const PDFBuffer =  await generatePDF(element.html);
    arrOfBuffers.push({ buffer: PDFBuffer, name: element.name });
  }

  
  return arrOfBuffers;
});
ipcMain.handle('save-all-files', async (event, arg) => {
 
  const filePath = await dialog.showOpenDialog(
    {
      buttonLabel: 'Wybierz Folder',
     
     properties:['openDirectory']
    }
  );

for(const element of arg){
  if(filePath.filePaths){
    const adres = `${filePath.filePaths[0]}\\Raport_${element.name}.pdf`
    
   await writeFile(adres,element.buffer,()=>{console.log("Zapisano Plik")})
    
  }
}
  

  return 'Udało się zapisać plik';
});

// mainWindow section
let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const bounds: any = WindowSettings.getWindowsSettings(storage);
  const positionBounds: any = WindowSettings.getWindowPosition(storage);
  mainWindow = new BrowserWindow({
    show: false,
    width: bounds[0],
    height: bounds[1],
    x: positionBounds[0],
    y: positionBounds[1],
    icon: getAssetPath('icon.png'),

    webPreferences: {
      nodeIntegration: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  mainWindow.on('resized', () => {
    WindowSettings.saveBounds(storage, mainWindow?.getSize());
  });
  mainWindow.on('moved', () => {
    WindowSettings.savePosition(storage, mainWindow?.getPosition());
  });
  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
