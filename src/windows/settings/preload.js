import { ipcRenderer, contextBridge, screen } from "electron";

contextBridge.exposeInMainWorld("staph", {});