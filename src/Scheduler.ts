import { ipcMain } from "electron";
import Settings from "./Settings";

export default class Scheduler {

    private scheduler: unknown = null
    private settings: Settings = null

    async setup() {
        this.settings = new Settings()
        this.scheduler = require('node-schedule')

        if (!await this.settings.hasSetting({ key: 'scheduler' })) {
            await this.settings.setSetting({ key: 'scheduler', data: { schedules: [] } })
        }

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

        const settings = await this.settings.getSetting({ key: 'scheduler' })

        return settings
    }

    async saveSchedulerSettings(settings: Record<string, unknown>) {

        await this.settings.setSetting({ key: 'scheduler', data: settings })
        return settings
    }
}

