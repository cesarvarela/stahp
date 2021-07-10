interface ISetting {
    key: string,
    data?: unknown,
}

interface ISchedule {
    id?: string,
    days: string[],
    hour: string,
    minutes: string,
}

interface IScheduleSettings {
    schedules: ISchedule[]
}

interface IActivitySettings {
    longBreakTargetTime: number
    activeTargetTime: number
}

interface IStahp {
    saveSchedulerSettings: (settings: IScheduleSettings) => Promise<any>,
    getSchedulerSettings: () => Promise<IScheduleSettings>,
    takeLongBreak: () => Promise<void>,
}

interface IStahpBlocker {
    close: () => Promise<void>,
    skipLongBreak: () => Promise<void>,
    openDevTools: () => Promise<void>,
    getLongBreakTime: () => Promise<number>,
    getLongBreakTargetTime: () => Promise<number>,
}

export { ISetting, IStahp, IStahpBlocker, ISchedule, IScheduleSettings, IActivitySettings }