import { ipcMain } from "electron";
import { IScheduleSettings } from "./interfaces";
import Settings from "./Settings";

export default class Scheduler {

    private scheduler: unknown = null
    private settings: Settings<IScheduleSettings> = null

    async setup() {
        this.settings = new Settings<IScheduleSettings>('scheduler', { schedules: [] })
        this.scheduler = require('node-schedule')

        ipcMain.handle('saveSchedulerSettings', (_, settings) => this.saveSchedulerSettings(settings))
        ipcMain.handle('getSchedulerSettings', () => this.getSchedulerSettings())
    }

    async loadScheduler() {

        const schedules = await this.getSchedulerSettings()

        //TODO: create schedules in node-schedule

        // const { cron, type, theme } = {}
        // this.scheduler.scheduleJob(`${type}:${theme}`, cron, () => {

        //     if (type === 'block') {

        //         if (!this.blockerWindows.length) {

        //             this.block()
        //         }
        //     }
        // })
    }

    async getSchedulerSettings() {

        const settings = await this.settings.get()

        return settings
    }

    async saveSchedulerSettings(settings: IScheduleSettings) {

        await this.settings.set(settings)
        return settings
    }
}

