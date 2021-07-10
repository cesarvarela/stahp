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


    private longBreakInterval: NodeJS.Timer = null
    private longBreakTime: number = 0
    private longBreakTargetTime: number = 0
    private onTakeLongBreak: () => void = null
    private onFinishLongBreak: () => void = null
    private onSkipLongBreak: () => void = null

    constructor(
        onTakeLongBreak: () => void,
        onFinishLongBreak: () => void,
        onSkipLongBreak: () => void,
    ) {

        this.onTakeLongBreak = onTakeLongBreak
        this.onFinishLongBreak = onFinishLongBreak
        this.onSkipLongBreak = onSkipLongBreak

        this.countIddleTime = true
    }

    async setup() {
        //TODO: does this work on windows?
        powerSaveBlocker.start('prevent-app-suspension')

        this.settings = new Settings<IActivitySettings>('activity', {
            activeTargetTime: 45 * 60,
            longBreakTargetTime: 5 * 60,
        })

        const settings = await this.settings.get()

        this.activeTargetTime = settings.activeTargetTime
        this.longBreakTargetTime = settings.longBreakTargetTime

        ipcMain.handle('takeLongBreak', () => this.takeLongBreak())
        ipcMain.handle('skipLongBreak', () => this.skipLongBreak())
        ipcMain.handle('getLongBreakTime', () => this.longBreakTime)
        ipcMain.handle('getLongBreakTargetTime', () => this.longBreakTargetTime)
    }

    skipLongBreak = () => {

        console.log('skip long break')

        clearInterval(this.longBreakInterval)
        this.onSkipLongBreak()
        this.track()
    }

    takeLongBreak = () => {

        console.log('long break')

        this.state = State.breaking
        this.longBreakTime = 0
        this.onTakeLongBreak()

        this.longBreakInterval = setInterval(() => {

            this.longBreakTime += 1

            console.log('long break time:', this.longBreakTime)

            if (this.longBreakTime >= this.longBreakTargetTime) {

                this.onFinishLongBreak()

                clearInterval(this.longBreakInterval)
                this.track()
            }

        }, 1000)
    }

    track = () => {

        console.log('tracking')

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

            console.log('active time:', this.activeTime)

            if (this.activeTime >= this.activeTargetTime) {
                this.takeLongBreak()
                clearInterval(this.activeInterval)
            }

        }, 1000)
    }

    stop = () => {
        clearInterval(this.activeInterval)
        clearInterval(this.longBreakInterval)

        this.activeTime = 0
        this.longBreakTime = 0
    }
}