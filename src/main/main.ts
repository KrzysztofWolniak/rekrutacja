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
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { timeStamp } from 'console';

interface ArrayElementType {
  [key: string]: string;
}

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});
ipcMain.on('price-list', async (event, arg) => {
  const PriceListArray: Array<Object> = [];
  console.time('Przetwarzanie na JSONA');
  console.log('Dostalem cennik');
  const XLSX = require('xlsx');
  const workbook = XLSX.read(arg);
  const workSheets: any = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const sheetName of workbook.SheetNames) {
    workSheets[sheetName] = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetName]
    );
  }
  console.timeEnd('Przetwarzanie na JSONA');
  console.time('Dodawanie gabarytow i przedziałow');
  const SetOfDimensions: Set<any> = new Set();
  //console.log(workSheets["Cennik fulfilment"])
  let StartCopying: boolean = false;

  workSheets['Cennik fulfilment'].forEach((obj: any) => {
    // console.log(obj.__EMPTY_2)
    if (obj.__EMPTY_2) {
      obj.__EMPTY_2.toString().includes('od 1')
        ? SetOfDimensions.add(obj)
        : null;
    }

    if (obj.__EMPTY) {
      if (obj.__EMPTY.toString().includes('kompletacja')) {
        StartCopying = true;
      } else if (obj.__EMPTY.toString().includes('*')) {
        StartCopying = false;
      }
    }
    StartCopying ? SetOfDimensions.add(obj) : null;
  });
  console.timeEnd('Dodawanie gabarytow i przedziałow');
  console.time('Tworzenie listy obiektow');
  if (SetOfDimensions != undefined) {
    
    const aaa = Array.from(SetOfDimensions);

    aaa.shift();
    const DimensionsObject: any = {};
    for (let index = 1; index < Object.keys(aaa[0]).length + 1; index++) {
      DimensionsObject[`PRZEDZIAL_${index}`] = aaa[0][`__EMPTY_${index * 2}`]
        .split(' ')
        .filter((el: any) => {
          if (!isNaN(el)) {
            return el;
          }
        });

      DimensionsObject[`PRZEDZIAL_${index}`] = DimensionsObject[
        `PRZEDZIAL_${index}`
      ].map((el: string) => {
        return Number(el);
      });
    }
    PriceListArray.push(DimensionsObject);
    aaa.forEach((el: any) => {
      const ArrayElement: ArrayElementType = {};
      if (el.__EMPTY_1 != undefined) {
        if (el.__EMPTY) {
          delete el.__EMPTY;
        }

        const elementDemension = el.__EMPTY_1.toString().split('\n');

        ArrayElement['GABARYT'] = elementDemension[0].split('\r').join();

        el.__EMPTY_1 = elementDemension[0];
        for (let index = 1; index < Object.keys(el).length / 2; index++) {
          ArrayElement[`NETTO_${index}`] = el[`__EMPTY_${index * 2}`];
          ArrayElement[`BRUTTO_${index}`] = el[`__EMPTY_${index * 2 + 1}`];
        }
        PriceListArray.push(ArrayElement);
      }
    });
    console.timeEnd('Tworzenie listy obiektow');
    console.log('Poczatek', PriceListArray);
  }
  event.reply('price-ranges',PriceListArray[0])
  PriceListArray.shift()
  event.reply('price-list',PriceListArray)
});
ipcMain.on('file', async (event, arg) => {
  console.log('dostalem plik');
  console.time('Przetwarzanie excela na jsona');

  const XLSX = require('xlsx');
  const workbook = XLSX.read(arg);
  const workSheets: any = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const sheetName of workbook.SheetNames) {
    workSheets[sheetName] = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetName]
    );
  }

  console.timeEnd('Przetwarzanie excela na jsona');
  console.time('Tworzenie bazy danych');

  // event.reply('file', JSON.stringify(workSheets.Zlecenia));
  const db: any = {
    sklepy: [
      {
        Name: 'SKLEP_1',
        KSIAZKA: 0,
        XS: 0,
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
        SZKLO: 0,
        ILOSC_ZAMOWIEN: new Set(),
        ZNIZKA: 0,
      },
      {
        Name: 'SKLEP_2',
        KSIAZKA: 0,
        XS: 0,
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
        SZKLO: 0,
        ILOSC_ZAMOWIEN: new Set(),
        ZNIZKA: 0,
      },
      {
        Name: 'SKLEP_3',
        KSIAZKA: 0,
        XS: 0,
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
        SZKLO: 0,
        ILOSC_ZAMOWIEN: new Set(),
        ZNIZKA: 0,
      },
      {
        Name: 'SKLEP_4',
        KSIAZKA: 0,
        XS: 0,
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
        SZKLO: 0,
        ILOSC_ZAMOWIEN: new Set(),
        ZNIZKA: 0,
      },
      {
        Name: 'SKLEP_5',
        KSIAZKA: 0,
        XS: 0,
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
        SZKLO: 0,
        ILOSC_ZAMOWIEN: new Set(),
        ZNIZKA: 0,
      },
      {
        Name: 'SKLEP_6',
        KSIAZKA: 0,
        XS: 0,
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
        SZKLO: 0,
        ILOSC_ZAMOWIEN: new Set(),
        ZNIZKA: 0,
      },
      {
        Name: 'SKLEP_7',
        KSIAZKA: 0,
        XS: 0,
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
        SZKLO: 0,
        ILOSC_ZAMOWIEN: new Set(),
        ZNIZKA: 0,
      },
      {
        Name: 'SKLEP_8',
        KSIAZKA: 0,
        XS: 0,
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
        SZKLO: 0,
        ILOSC_ZAMOWIEN: new Set(),
        ZNIZKA: 0,
      },
      {
        Name: 'SKLEP_9',
        KSIAZKA: 0,
        XS: 0,
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
        SZKLO: 0,
        ILOSC_ZAMOWIEN: new Set(),
        ZNIZKA: 0,
      },
    ],
  };
  console.timeEnd('Tworzenie bazy danych');
  console.time('Glowny algorytm');

  workSheets.Zlecenia.forEach((obj: any) => {
    obj.gabaryt = obj.gabaryt.split('_');
    const test = db.sklepy.find((x: any) => {
      return x.Name == obj.Departament;
    });
    if (test !== undefined) {
      if (obj.gabaryt.length == 2) {
        test[obj.gabaryt[0]] += obj.quantity;
        test[obj.gabaryt[1]] += obj.quantity;
        test.ILOSC_ZAMOWIEN.add(obj.order_id);
      } else {
        test[obj.gabaryt[0]] += obj.quantity;
        test.ILOSC_ZAMOWIEN.add(obj.order_id);
      }
    }
  });
  db.sklepy.forEach((obj: any) => {
    obj.ILOSC_ZAMOWIEN = obj.ILOSC_ZAMOWIEN.size;
  });
  console.log('Kurna no', db);
  console.timeEnd('Glowny algorytm');

  // console.log(workSheets.Zlecenia);
  // console.log(workbook);
});
ipcMain.on('file-path', async (event, arg) => {
  console.log('dostalem sciezke pliku');
  console.log(arg);
});

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

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),

    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
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
