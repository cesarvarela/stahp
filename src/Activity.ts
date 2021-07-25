import { ipcMain, powerMonitor, powerSaveBlocker } from "electron";
import { IActivitySettings } from "./interfaces";
import Settings from "./Settings";

enum State {
    tracking,
    breaking,
}

export default class Activity {

    private state: State = State.tracking
    private settings: Settings<IActivitySettings> = null

    private countIddleTime: boolean = false

    private activeInterval: NodeJS.Timer = null
    private activeTime: number = 0
    private activeTargetTime: number = 0
    private enabled: boolean = null

    private longBreakInterval: NodeJS.Timer = null
    private longBreakTime: number = 0
    private longBreakTargetTime: number = 0
    private onFinishActivity: () => void = null
    private onFinishLongBreak: () => void = null

    constructor(
        onFinishActivity: () => void,
        onFinishLongBreak: () => void,
    ) {

        this.onFinishActivity = onFinishActivity
        this.onFinishLongBreak = onFinishLongBreak

        this.countIddleTime = true
    }

    async setup() {
        //TODO: does this work on windows?
        powerSaveBlocker.start('prevent-app-suspension')

        this.settings = new Settings<IActivitySettings>('activity', {
            activeTargetTime: 45 * 60,
            longBreakTargetTime: 5 * 60,
            enabled: true,
        })

        const settings = await this.settings.get()

        this.activeTargetTime = settings.activeTargetTime
        this.longBreakTargetTime = settings.longBreakTargetTime
        this.enabled = settings.enabled

        ipcMain.handle('getLongBreakTime', () => this.longBreakTime)
        ipcMain.handle('getLongBreakTargetTime', () => this.longBreakTargetTime)

        ipcMain.handle('getActiveTargetTime', () => this.activeTargetTime)
        ipcMain.handle('getActiveTime', () => this.activeTime)

        ipcMain.handle('getActivitySettings', () => { return this.settings.get() })
        ipcMain.handle('setActivitySettings', async (_, settings: IActivitySettings) => {

            const updated = await this.settings.set(settings)

            this.activeTargetTime = updated.activeTargetTime
            this.longBreakTargetTime = updated.longBreakTargetTime
            this.enabled = updated.enabled

            if (updated.enabled) {

                this.start()
            } else {

                this.stop()
            }

            return updated
        })

        if (settings.enabled) {

            this.start()
        }
    }

    longBreak = () => {

        console.log('long break')

        this.clearIntervals()
        this.state = State.breaking
        this.longBreakTime = 0

        this.longBreakInterval = setInterval(() => {

            this.longBreakTime += 1

            console.log('long break time:', this.longBreakTargetTime - this.longBreakTime)

            if (this.longBreakTime >= this.longBreakTargetTime) {

                clearInterval(this.longBreakInterval)
                this.onFinishLongBreak()
            }

        }, 1000)
    }

    start = () => {

        if (this.enabled) {

            console.log('tracking')

            this.clearIntervals()
            this.state = State.tracking
            this.activeTime = 0
            this.activeInterval = setInterval(async () => {

                if (this.countIddleTime) {
                    this.activeTime += 1
                }
                else {

                    const iddleTime = await powerMonitor.getSystemIdleTime()

                    if (iddleTime < 1) {
                        this.activeTime += 1
                    }
                }

                console.log('active time:', this.activeTargetTime - this.activeTime)

                if (this.activeTime >= this.activeTargetTime) {

                    clearInterval(this.activeInterval)
                    this.onFinishActivity()
                }

            }, 1000)
        }
        else {

            console.log('do not start because module is disabled')
        }
    }

    private clearIntervals = () => {

        clearInterval(this.activeInterval)
        clearInterval(this.longBreakInterval)
        this.activeInterval = null
        this.longBreakInterval = null
    }

    stop = () => {

        this.clearIntervals()
        this.activeTime = 0
        this.longBreakTime = 0
    }
}