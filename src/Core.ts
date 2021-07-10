import { Tray, Menu, app, BrowserWindow, ipcMain, screen, shell } from 'electron'
import path from 'path'
import storage from 'electron-json-storage'
import { Display } from 'electron/main';
import Activity from './Activity';
import Settings from './Settings';
import Scheduler from './Scheduler';
import Themes from './Themes';
import { fadeWindowIn, fadeWindowOut } from './Fade';

declare const SETTINGS_WEBPACK_ENTRY: string;
declare const SETTINGS_PRELOAD_WEBPACK_ENTRY: string;

declare const BLOCKER_PRELOAD_WEBPACK_ENTRY: string;

class Core {

    private settingsWindow: BrowserWindow = null
    private tray: Tray = null
    private windows: BrowserWindow[] = []
    private scheduler: Scheduler = null
    private activity: Activity = null
    private settings: Settings = null
    private themes: Themes = null

    async init() {
        await this.setupTray()
        await this.setupIpc()
        await this.openSettingsWindow()

        await this.setupScheduler()
        await this.setupActivity()
        await this.setupThemes()

        // this.activity.track()
    }

    setupScheduler() {

        this.scheduler = new Scheduler()
        this.scheduler.setup()
    }

    setupActivity() {

        this.activity = new Activity(
            () => {

                this.block()

            }, () => {

                this.unblock()
            },
            () => {

                this.unblock()
            }
        )

        this.activity.setup()
    }

    setupThemes() {
        this.themes = new Themes()
        this.themes.setup()
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

    setupIpc() {

        ipcMain.handle('close', async (e) => {
            // @ts-ignore
            e.sender.destroy()

            if (this.windows.every(w => w.isDestroyed())) {
                this.activity.skipLongBreak()
            }
        })

        ipcMain.handle('openDevTools', async (e) => {

            e.sender.openDevTools()
        })

        ipcMain.handle('block', async (e) => {

            this.block()
        })

        ipcMain.handle('unblock', async (e) => {

            this.unblock()
        })
    }

    async unblock() {

        for (const window of this.windows) {

            if (!window.isDestroyed()) {

                await fadeWindowOut(window)
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
            enableLargerThanScreen: true,
            opacity: 0,
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

        await fadeWindowIn(window)

        return window
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