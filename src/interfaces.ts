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

interface IGeneralSettings extends Record<string, unknown> {
    theme: "light" | "dark"
}

interface IThemesSettings extends Record<string, unknown> {
    theme: string,
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

    getGeneralSettings: () => Promise<IGeneralSettings>,
}

interface IStahpBlocker {
    close: () => Promise<void>,
    skipBreak: () => Promise<void>,
    openDevTools: () => Promise<void>,
    getLongBreakTime: () => Promise<number>,
    getLongBreakTargetTime: () => Promise<number>,
    getGeneralSettings: () => Promise<IGeneralSettings>,
    getThemesSettings: () => Promise<IThemesSettings>,
}

export { ISetting, IStahp, IStahpBlocker, ISchedule, IScheduleSettings, IActivitySettings, IGeneralSettings, IThemesSettings }