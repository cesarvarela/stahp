import { ipcRenderer, contextBridge } from "electron";
import { ISetting } from "../../interfaces";

contextBridge.exposeInMainWorld("stahp", {
    saveSchedulerSettings: (settings: ISetting) => ipcRenderer.invoke('saveSchedulerSettings', settings),
    getSchedulerSettings: () => ipcRenderer.invoke('getSchedulerSettings'),
    block: () => ipcRenderer.invoke('block'),
    unblock: () => ipcRenderer.invoke('unblock'),
    takeLongBreak: () => ipcRenderer.invoke('takeLongBreak'),
});