import { ipcRenderer, contextBridge } from "electron";
import { IStahpBlocker } from "../../interfaces";

const api: IStahpBlocker = {
    close: () => ipcRenderer.invoke('close'),
    openDevTools: () => ipcRenderer.invoke('openDevTools'),
    getLongBreakTime: () => ipcRenderer.invoke('getLongBreakTime'),
    getLongBreakTargetTime: () => ipcRenderer.invoke('getLongBreakTargetTime'),
    skipBreak: () => ipcRenderer.invoke('skipBreak'),
    getGeneralSettings: () => ipcRenderer.invoke('getGeneralSettings'),
    getThemesSettings: () => ipcRenderer.invoke('getThemesSettings'),
}

contextBridge.exposeInMainWorld("stahpblocker", api);