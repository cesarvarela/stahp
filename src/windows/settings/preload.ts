import { ipcRenderer, contextBridge } from "electron";
import { IScheduleSettings, ISetting, IStahp } from "../../interfaces";

const api: IStahp = {
    saveSchedulerSettings: (settings: IScheduleSettings) => ipcRenderer.invoke('saveSchedulerSettings', settings),
    getSchedulerSettings: () => ipcRenderer.invoke('getSchedulerSettings'),
    takeLongBreak: () => ipcRenderer.invoke('takeLongBreak'),
}

contextBridge.exposeInMainWorld("stahp", api);