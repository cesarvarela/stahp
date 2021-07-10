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
    close: () => Promise<void>,
    saveSchedulerSettings: (settings: IScheduleSettings) => Promise<void>,
    getSchedulerSettings: () => Promise<IScheduleSettings>,
    block: () => Promise<void>,
    unblock: () => Promise<void>,
    takeLongBreak: () => Promise<void>,
}

export { ISetting, IStahp, ISchedule, IScheduleSettings, IActivitySettings }