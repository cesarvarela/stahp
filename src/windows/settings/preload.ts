import { ipcRenderer, contextBridge } from "electron";
import { IActivitySettings, IScheduleSettings, IStahp } from "../../interfaces";
import * as Sentry from "@sentry/electron/dist/renderer";

Sentry.init({ dsn: "https://0a6134a5d89d40c4954c6144b0e63c64@o944978.ingest.sentry.io/5893671" });

const api: IStahp = {
    saveSchedulerSettings: (settings: IScheduleSettings) => ipcRenderer.invoke('saveSchedulerSettings', settings),
    getSchedulerSettings: () => ipcRenderer.invoke('getSchedulerSettings'),

    takeIndefiniteBreak: () => ipcRenderer.invoke('takeIndefiniteBreak'),

    takeLongBreak: (options) => ipcRenderer.invoke('takeLongBreak', options),
    getActivitySettings: () => ipcRenderer.invoke('getActivitySettings'),
    setActivitySettings: (settings: IActivitySettings) => ipcRenderer.invoke('setActivitySettings', settings),

    getLongBreakTime: () => ipcRenderer.invoke('getLongBreakTime'),
    getLongBreakTargetTime: () => ipcRenderer.invoke('getLongBreakTargetTime'),

    getActiveTargetTime: () => ipcRenderer.invoke('getActiveTargetTime'),
    getActiveTime: () => ipcRenderer.invoke('getActiveTime'),

    getGeneralSettings: () => ipcRenderer.invoke('getGeneralSettings'),

    searchThemes: (query: string) => ipcRenderer.invoke('searchThemes', query),
    downloadTheme: (name: string) => ipcRenderer.invoke('downloadTheme', name),
    getDownloadedThemes: () => ipcRenderer.invoke('getDownloadedThemes'),
    deleteTheme: (name: string) => ipcRenderer.invoke('deleteTheme', name),

    openDevTools: () => ipcRenderer.invoke('openDevTools'),
    getVersion: () => ipcRenderer.invoke('getVersion'),
}

contextBridge.exposeInMainWorld("stahp", api);