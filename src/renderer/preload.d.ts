/* eslint-disable @typescript-eslint/ban-types */
import {
  Channels,
  DownloadAllPDF,
  DownloadPDF,
  FileChannel,
  FilePathChannel,
  PriceList,
  PriceRanges,
  SaveAllFiles,
  SaveFile,
} from 'main/preload';
import { Gabaryty, Przedzialy } from './pages/AddFile';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        sendListOfOrders(channel: FileChannel, args: unknown): void;
        sendPriceList(
          channel: PriceList,
          args: unknown
        ): Array<Przedzialy & Gabaryty>;
        once(channel: Channels, func: (...args: unknown[]) => void): void;
        downloadPdf(channel: DownloadPDF, args: unknown): ArrayBuffer;
        saveFile(channel: SaveFile, args: unknown): any;
        saveAllFiles(channel: SaveAllFiles, args: unknown): any;
        downloadAllPdf(channel: DownloadAllPDF, args: unknown): any;
      };
    };
  }
}

export {};
