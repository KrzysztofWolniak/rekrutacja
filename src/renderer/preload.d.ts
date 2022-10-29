import {
  Channels,
  FileChannel,
  FilePathChannel,
  PriceList,
  PriceRanges,
} from 'main/preload';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        sendFile(channel: FileChannel, args: unknown): void;
        sendPriceList(channel: PriceList, args: unknown): void;
        sendFilePath(channel: FilePathChannel, args: unknown): void;
        deleteListners(channel: PriceList | PriceRanges): void;
        on(
          channel: PriceList,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: Channels, func: (...args: unknown[]) => void): void;
        sendDimensions(channel: PriceList, func: (arg: any) => void): void;
        sendRanges(channel: PriceRanges, func: (arg: any) => void): void;
      };
    };
  }
}

export {};
