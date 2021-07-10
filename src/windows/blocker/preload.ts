import { ipcRenderer, contextBridge } from "electron";
import { IStahpBlocker } from "../../interfaces";

const api: IStahpBlocker = {
    close: () => ipcRenderer.invoke('close'),
    openDevTools: () => ipcRenderer.invoke('openDevTools'),
    getLongBreakTime: () => ipcRenderer.invoke('getLongBreakTime'),
    getLongBreakTargetTime: () => ipcRenderer.invoke('getLongBreakTargetTime'),
    skipLongBreak: () => ipcRenderer.invoke('skipLongBreak'),
}

contextBridge.exposeInMainWorld("stahpblocker", api);