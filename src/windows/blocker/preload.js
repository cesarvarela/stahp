import { ipcRenderer, contextBridge, screen } from "electron";

contextBridge.exposeInMainWorld("stahp", {
    close: () => ipcRenderer.invoke('close'),
});