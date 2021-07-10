import { powerMonitor, powerSaveBlocker } from "electron";
import Settings from "./Settings";

enum State {
    track,
    break,
}

export default class Activity {

    private state: State = State.track
    private settings: Settings = null

    private countIddleTime: boolean = false

    private activeInterval: NodeJS.Timer = null
    private activeTime: number = 0
    private activeTargetTime: number = 0


    private longBreakInterval: NodeJS.Timer = null
    private longBreakTime: number = 0
    private longBreakTargetTime: number = 0
    private onTakeLongBreak: () => void = null
    private onFinishLongBreak: () => void = null

    constructor(
        onTakeLongBreak: () => void,
        onFinishLongBreak: () => void,
    ) {

        this.onTakeLongBreak = onTakeLongBreak
        this.onFinishLongBreak = onFinishLongBreak

        this.activeTargetTime = 10
        this.longBreakTargetTime = 5
        this.countIddleTime = true
    }

    async setup() {
        //TODO: does this work on windows?
        powerSaveBlocker.start('prevent-app-suspension')
        this.settings = new Settings()
    }

    skipLongBreak = () => {
        clearInterval(this.longBreakInterval)
        this.track()
    }

    takeLongBreak = () => {

        console.log('long break')

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