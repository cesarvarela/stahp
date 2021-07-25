import { ipcRenderer, contextBridge } from "electron";
import { IActivitySettings, IScheduleSettings, IStahp } from "../../interfaces";

const api: IStahp = {
    saveSchedulerSettings: (settings: IScheduleSettings) => ipcRenderer.invoke('saveSchedulerSettings', settings),
    getSchedulerSettings: () => ipcRenderer.invoke('getSchedulerSettings'),

    takeIndefiniteBreak: () => ipcRenderer.invoke('takeIndefiniteBreak'),

    takeLongBreak: (dev) => ipcRenderer.invoke('takeLongBreak', dev),
    getActivitySettings: () => ipcRenderer.invoke('getActivitySettings'),
    setActivitySettings: (settings: IActivitySettings) => ipcRenderer.invoke('setActivitySettings', settings),

    getLongBreakTime: () => ipcRenderer.invoke('getLongBreakTime'),
    getLongBreakTargetTime: () => ipcRenderer.invoke('getLongBreakTargetTime'),

    getActiveTargetTime: () => ipcRenderer.invoke('getActiveTargetTime'),
    getActiveTime: () => ipcRenderer.invoke('getActiveTime'),

    getGeneralSettings: () => ipcRenderer.invoke('getGeneralSettings'),

    searchThemes: (query: string) => ipcRenderer.invoke('searchThemes', query),

    downloadTheme: (name: string) => ipcRenderer.invoke('downloadTheme', name),
}

contextBridge.exposeInMainWorld("stahp", api);