import { Tray, Menu, app, BrowserWindow, ipcMain, screen, shell } from 'electron'
import path from 'path'
import storage from 'electron-json-storage'
import { Octokit } from 'octokit';
import { Display } from 'electron/main';
import Activity from './Activity';
import Settings from './Settings';

declare const SETTINGS_WEBPACK_ENTRY: string;
declare const SETTINGS_PRELOAD_WEBPACK_ENTRY: string;

declare const BLOCKER_PRELOAD_WEBPACK_ENTRY: string;

class Core {

    private settingsWindow: BrowserWindow = null
    private tray: Tray = null
    private octokit: Octokit = null
    private windows: BrowserWindow[] = []
    private scheduler: unknown = null
    private activity: Activity = null
    private settings: Settings = null

    async init() {
        await this.setupStorage()
        await this.setupTray()
        await this.setupIpc()
        await this.openSettingsWindow()
        await this.setupScheduler()
        await this.setupActivity()
    }

    setupActivity() {

        this.activity = new Activity()

        this.activity.track()
    }

    setupTray() {

        this.tray = new Tray(path.join(__dirname, 'assets', 'pause.png'));

        const menu = Menu.buildFromTemplate([
            {
                label: 'Settings',
                click: () => {
                    this.openSettingsWindow()
                }
            },
            {
                label: 'Open settings folder',
                click: () => {

                    shell.showItemInFolder(storage.getDefaultDataPath())
                }
            },
            {
                label: 'Quit',
                click: () => {
                    app.quit()
                }
            }
        ])

        this.tray.setContextMenu(menu)
    }

    async setupStorage() {

        this.settings = new Settings()

        if (!await this.settings.hasSetting({ key: 'scheduler' })) {
            await this.settings.setSetting({ key: 'scheduler', data: { schedules: [] } })
        }
    }

    setupIpc() {

        ipcMain.handle('close', async (e) => {
            // @ts-ignore
            e.sender.destroy()
        })

        ipcMain.handle('saveSchedulerSettings', (_, settings) => this.saveSchedulerSettings(settings))
        ipcMain.handle('getSchedulerSettings', () => this.getSchedulerSettings())
    }

    async setupScheduler() {

        this.scheduler = require('node-schedule')
    }

    async loadScheduler() {

        const schedules = await this.getSchedulerSettings()

        //TODO: create schedules in node-schedule

        // const { cron, type, theme } = {}
        // this.scheduler.scheduleJob(`${type}:${theme}`, cron, () => {

        //     if (type === 'block') {

        //         if (!this.blockerWindows.length) {

        //             this.block()
        //         }
        //     }
        // })
    }

    async getSchedulerSettings() {

        const settings = await this.settings.getSetting({ key: 'scheduler' })

        return settings
    }

    async saveSchedulerSettings(settings: Record<string, unknown>) {

        await this.settings.setSetting({ key: 'scheduler', data: settings })
        return settings
    }

    async unblock() {

        for (const window of this.windows) {

            if (!window.isDestroyed()) {
                window.destroy()
            }
        }

        this.windows = []
    }

    async block() {

        await this.unblock()

        const displays = screen.getAllDisplays()

        for (const display of displays) {
            const window = await this.openBlockerWindow({ display })
            this.windows.push(window)
        }
    }

    async openBlockerWindow({ display }: { display: Display }) {

        const window = new BrowserWindow({
            ...display.bounds,
            frame: false,
            skipTaskbar: true,
            webPreferences: {
                preload: BLOCKER_PRELOAD_WEBPACK_ENTRY
            },
        });

        window.loadFile(path.resolve(app.getAppPath(), 'themes', 'default', 'index.html'))

        window.setAlwaysOnTop(true, "screen-saver")

        //TODO: https://github.com/electron/electron/issues/10862
        setTimeout(() => window.setBounds(display.bounds), 0);
        setTimeout(() => window.setBounds(display.bounds), 0);
        setTimeout(() => window.setBounds(display.bounds), 0);
        setTimeout(() => window.setBounds(display.bounds), 0);

        return window
    }

    async downloadTheme() {

        if (!this.octokit) {

            const { Octokit } = require('octokit')

            this.octokit = new Octokit({
                userAgent: 'stahp/v0.1',
            })
        }

        const repo = await this.octokit.rest.repos.downloadArchive({ owner: `cesarvarela`, repo: `stahp-default`, ref: 'master' })
        //TODO: unzip and stuff here
    }

    async openSettingsWindow() {

        if (this.settingsWindow && !this.settingsWindow.isDestroyed()) {

            this.settingsWindow.show()
        }
        else {

            this.settingsWindow = new BrowserWindow({
                width: 800,
                height: 600,
                icon: path.join(__dirname, 'assets', 'pause.png'),
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: true,
                    enableRemoteModule: true,
                    preload: SETTINGS_PRELOAD_WEBPACK_ENTRY
                },
            });

            this.settingsWindow.setMenu(null)
            this.settingsWindow.loadURL(SETTINGS_WEBPACK_ENTRY)

            if (!app.isPackaged) {

                this.settingsWindow.webContents.openDevTools()
            }
        }
    }
}

export default Core