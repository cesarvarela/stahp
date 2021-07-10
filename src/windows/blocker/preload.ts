import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("stahp", {
    close: () => ipcRenderer.invoke('close'),
    unblock: () => ipcRenderer.invoke('unblock'),
});