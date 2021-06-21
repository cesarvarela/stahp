import { ipcRenderer, contextBridge, screen } from "electron";

contextBridge.exposeInMainWorld("stahp", {
    saveSchedulerSettings: (settings) => ipcRenderer.invoke('saveSchedulerSettings', settings),
    getSchedulerSettings: () => ipcRenderer.invoke('getSchedulerSettings'),
});