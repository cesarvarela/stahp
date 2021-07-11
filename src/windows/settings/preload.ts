import { ipcRenderer, contextBridge } from "electron";
import { IActivitySettings, IScheduleSettings, IStahp } from "../../interfaces";

const api: IStahp = {
    saveSchedulerSettings: (settings: IScheduleSettings) => ipcRenderer.invoke('saveSchedulerSettings', settings),
    getSchedulerSettings: () => ipcRenderer.invoke('getSchedulerSettings'),
    takeLongBreak: () => ipcRenderer.invoke('takeLongBreak'),
    getActivitySettings: () => ipcRenderer.invoke('getActivitySettings'),
    setActivitySettings: (settings: IActivitySettings) => ipcRenderer.invoke('setActivitySettings', settings),
}

contextBridge.exposeInMainWorld("stahp", api);