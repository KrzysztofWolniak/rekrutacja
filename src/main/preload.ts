import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';
export type FileChannel = 'file';
export type FilePathChannel = 'file-path';
export type PriceList = 'price-list';
export type PriceRanges = 'price-ranges';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: PriceList, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    sendDimensions(channel: PriceList, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);
    },
    sendRanges(channel: PriceRanges, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);
    },
    sendFile(channel: FileChannel, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    sendPriceList(channel: PriceList, args: Array<object>) {
      ipcRenderer.send(channel, args);
    },
    deleteListners(channel: PriceList | PriceRanges) {
      ipcRenderer.removeAllListeners(channel);
    },
  },
});
