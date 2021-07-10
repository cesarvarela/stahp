import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("stahp", {
    close: () => ipcRenderer.invoke('close'),
    unblock: () => ipcRenderer.invoke('unblock'),
    getLongBreakTime: () => ipcRenderer.invoke('getLongBreakTime'),
    getLongBreakTargetTime: () => ipcRenderer.invoke('getLongBreakTargetTime'),
    skipLongBreak: () => ipcRenderer.invoke('skipLongBreak'),
});