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
    enabled: boolean,
    theme: string,
}

interface IGeneralSettings extends Record<string, unknown> {
    theme: "light" | "dark"
}

interface IThemesSettings extends Record<string, unknown> {
}

interface IThemePackage {
    date: Date,
    links: { npm: string }
    maintainers: []
    name: string
    publisher: { username: string, email: string }
    scope: string
    version: string
    status: "available" | "downloaded" | "downloading" | "error"
}

interface IStahp {
    saveSchedulerSettings: (settings: IScheduleSettings) => Promise<any>,
    getSchedulerSettings: () => Promise<IScheduleSettings>,

    takeIndefiniteBreak: () => Promise<any>,
    takeLongBreak: (options?: { theme?: string }) => Promise<void>,

    getLongBreakTime: () => Promise<number>,
    getLongBreakTargetTime: () => Promise<number>,
    setActivitySettings: (settings: IActivitySettings) => Promise<IActivitySettings>,
    getActivitySettings: () => Promise<IActivitySettings>,

    getActiveTargetTime: () => Promise<number>,
    getActiveTime: () => Promise<number>,

    getGeneralSettings: () => Promise<IGeneralSettings>,

    searchThemes: (query: string) => Promise<IThemePackage[]>,
    downloadTheme: (name: string) => Promise<IThemePackage>,
    getDownloadedThemes: () => Promise<IThemePackage[]>,
    deleteTheme: (name: string) => Promise<boolean>,
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

export { ISetting, IStahp, IStahpBlocker, ISchedule, IScheduleSettings, IActivitySettings, IGeneralSettings, IThemesSettings, IThemePackage }