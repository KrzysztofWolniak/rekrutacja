import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';
export type FileChannel = 'file';
export type FilePathChannel = 'file-path';
export type PriceList = 'price-list';
export type PriceRanges = 'price-ranges';
export type DownloadPDF = 'download-pdf';
export type SaveFile = 'save-file';
export type SaveAllFiles = 'save-all-files';
export type DownloadAllPDF = 'download-all-pdf';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    async sendListOfOrders(channel: FileChannel, args: unknown[]) {
      const test = await ipcRenderer.invoke(channel, args);
      return test;
    },
    async sendPriceList(channel: PriceList, args: Array<object>) {
      const test = await ipcRenderer.invoke(channel, args);
      return test;
    },
    async downloadPdf(channel: DownloadPDF, args: string) {
      const test = await ipcRenderer.invoke(channel, args);
      return test;
    },
    async saveFile(channel: SaveFile, args: string) {
      const test = await ipcRenderer.invoke(channel, args);
      return test;
    },
    async saveAllFiles(channel: SaveFile, args: string) {
      const test = await ipcRenderer.invoke(channel, args);
      return test;
    },
    async downloadAllPdf(channel: DownloadAllPDF, args: string) {
      const test = await ipcRenderer.invoke(channel, args);
      return test;
    },
  },
});
