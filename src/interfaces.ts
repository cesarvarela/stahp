interface ISetting {
    key: string,
    data?: unknown,
}

interface ISchedule {
    id?: string,
    days: string[],
    hour: number,
    minutes: number,
}

interface IScheduleSettings extends Record<string, unknown> {
    schedules: ISchedule[]
}

interface IActivitySettings extends Record<string, unknown> {
    longBreakTargetTime: number
    activeTargetTime: number
    enabled: boolean
}

type Theme = "light" | "dark";

interface IGeneralSettings extends Record<string, unknown> {
    theme: Theme
}

interface IStahp {
    saveSchedulerSettings: (settings: IScheduleSettings) => Promise<any>,
    getSchedulerSettings: () => Promise<IScheduleSettings>,

    takeIndefiniteBreak: () => Promise<any>,
    takeLongBreak: (dev?: boolean) => Promise<void>,

    getLongBreakTime: () => Promise<number>,
    getLongBreakTargetTime: () => Promise<number>,
    setActivitySettings: (settings: IActivitySettings) => Promise<IActivitySettings>,
    getActivitySettings: () => Promise<IActivitySettings>,

    getActiveTargetTime: () => Promise<number>,
    getActiveTime: () => Promise<number>,
}

interface IStahpBlocker {
    close: () => Promise<void>,
    skipBreak: () => Promise<void>,
    openDevTools: () => Promise<void>,
    getLongBreakTime: () => Promise<number>,
    getLongBreakTargetTime: () => Promise<number>,
}

export { ISetting, IStahp, IStahpBlocker, ISchedule, IScheduleSettings, IActivitySettings, IGeneralSettings, Theme }