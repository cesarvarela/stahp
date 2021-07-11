import { ipcMain } from "electron";
import { IScheduleSettings } from "./interfaces";
import Settings from "./Settings";
import * as scheduler from "node-schedule";

const mapDayToSchedule = (day: string) => {

    const days = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
    ]
    return days.indexOf(day);
}
export default class Scheduler {

    private settings: Settings<IScheduleSettings> = null
    private onScheduledBreak: () => void

    constructor(onScheduledBreakStart: () => void) {

        this.onScheduledBreak = onScheduledBreakStart
    }

    async setup() {
        this.settings = new Settings<IScheduleSettings>('scheduler', { schedules: [] })

        ipcMain.handle('getSchedulerSettings', () => this.settings.get())
        ipcMain.handle('saveSchedulerSettings', async (_, settings: IScheduleSettings) => {
            await this.settings.set(settings)
            this.stop()
            this.start()
        })

        this.start()
    }

    async stop() {

        Object.keys(scheduler.scheduledJobs).forEach(jobId => {

            console.log(`Cancelling job ${jobId}, success: `, scheduler.cancelJob(jobId))
        })
    }

    async start() {

        const { schedules } = await this.settings.get()

        for (const schedule of schedules) {

            const rule = new scheduler.RecurrenceRule();
            rule.hour = schedule.hour;
            rule.minute = schedule.minutes;
            rule.dayOfWeek = schedule.days.map(mapDayToSchedule);

            const jobId = `${rule.hour}-${rule.minute}-${rule.dayOfWeek.join(',')}`

            const job = scheduler.scheduleJob(
                jobId,
                rule,
                () => {
                    this.onScheduledBreak()
                })

            console.log(`Scheduled job ${jobId} for: `, job.nextInvocation().toISOString())
        }
    }
}

