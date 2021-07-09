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

interface IStahp {
    close: () => Promise<void>,
    saveSchedulerSettings: (settings: IScheduleSettings) => Promise<void>,
    getSchedulerSettings: () => Promise<IScheduleSettings>,
}

export { ISetting, IStahp, ISchedule, IScheduleSettings }