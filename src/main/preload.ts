import { contextBridge, ipcRenderer } from 'electron';

import type { IpcRendererEvent } from 'electron';

const apiHandler = {
  ipcRenderer: {
    sendMessage<T>(channel: string, ...args: T[]): void {
      ipcRenderer.send(channel, ...args);
    },
    on<T>(channel: string, func: (...args: T[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: T[]): void =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return (): void => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once<T>(channel: string, func: (...args: T[]) => void): void {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('api', apiHandler);

export type ApiHandler = typeof apiHandler;
