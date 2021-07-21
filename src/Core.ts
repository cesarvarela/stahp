import { Tray, Menu, app, BrowserWindow, ipcMain, screen, shell, nativeTheme } from 'electron'
import path from 'path'
import storage from 'electron-json-storage'
import { Display } from 'electron/main';
import Activity from './Activity';
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
    private shorts: BrowserWindow[] = []
    private scheduler: Scheduler = null
    private activity: Activity = null
    private themes: Themes = null

    async init() {
        await this.setupTray()
        await this.setupIpc()
        await this.openSettingsWindow()

        await this.setupScheduler()
        await this.setupActivity()
        await this.setupThemes()
    }

    setupThemes() {
        this.themes = new Themes()
        this.themes.setup()
    }

    setupTray() {

        this.tray = new Tray(path.join(__dirname, 'assets', nativeTheme.shouldUseDarkColors ? 'icon-white@2x.png' : 'icon-black@2x.png'));

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

    setupScheduler() {

        this.scheduler = new Scheduler(
            () => {

                this.activity.stop()
                this.block()
            }
        )

        this.scheduler.setup()
    }

    setupActivity() {

        this.activity = new Activity(
            () => {

                this.activity.takeLongBreak()
                this.block()

            }, () => {

                this.activity.start()
                this.unblock()
            },
        )

        this.activity.setup()
    }

    setupIpc() {

        ipcMain.handle('close', async (e) => {
            // @ts-ignore
            e.sender.destroy()

            if (this.windows.every(w => w.isDestroyed())) {
                this.activity.stop()
                this.activity.start()
            }
        })

        ipcMain.handle('takeLongBreak', (_, dev: boolean = false) => {

            this.block(dev)
            this.activity.takeLongBreak()
        })

        ipcMain.handle('skipBreak', async () => {

            this.activity.stop()
            this.activity.start()

            this.unblock()
        })

        ipcMain.handle('takeIndefiniteBreak', () => {

            this.activity.stop()

            // this.short()
            this.block()
        })

        ipcMain.handle('openDevTools', async (e) => {

            e.sender.openDevTools()
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

    async block(dev: boolean = false) {

        await this.unblock()

        const displays = screen.getAllDisplays()

        for (const display of displays) {
            const window = await this.openBlockerWindow({ display, dev })
            this.windows.push(window)
        }
    }

    async short() {

        const displays = screen.getAllDisplays()

        for (const display of displays) {
            const window = await this.openShortWindow({ display })
            this.shorts.push(window)
        }
    }

    async openShortWindow({ display }: { display: Display }) {

        const size = { width: 400, height: 200 }
        const bounds: Electron.Rectangle = { ...size, x: display.bounds.x + (display.bounds.width - size.width) / 2, y: display.bounds.y + (display.bounds.height - size.height) / 2 }

        const window = new BrowserWindow({
            ...bounds,
            frame: false,
            skipTaskbar: true,
            opacity: 0,
            vibrancy: 'light',
            webPreferences: {
                preload: SETTINGS_WEBPACK_ENTRY
            },
        });

        window.loadFile(path.resolve(app.getAppPath(), 'themes', 'default', 'short.html'))
        window.setAlwaysOnTop(true, "screen-saver")

        //TODO: https://github.com/electron/electron/issues/10862
        setTimeout(() => window.setBounds(bounds), 0);
        setTimeout(() => window.setBounds(bounds), 0);
        setTimeout(() => window.setBounds(bounds), 0);
        setTimeout(() => window.setBounds(bounds), 0);

        await fadeWindowIn(window)

        return window
    }

    async openBlockerWindow({ display, dev }: { display: Display, dev: boolean }) {

        const window = new BrowserWindow({
            ...display.bounds,
            frame: dev,
            skipTaskbar: true,
            enableLargerThanScreen: true,
            opacity: 0,
            webPreferences: {
                preload: BLOCKER_PRELOAD_WEBPACK_ENTRY
            },
        });

        window.loadFile(path.join(__dirname, 'themes', 'default', 'long.html'))

        if (!dev) {

            window.setAlwaysOnTop(true, "screen-saver")
            //TODO: https://github.com/electron/electron/issues/10862
            setTimeout(() => window.setBounds(display.bounds), 0);
            setTimeout(() => window.setBounds(display.bounds), 0);
            setTimeout(() => window.setBounds(display.bounds), 0);
            setTimeout(() => window.setBounds(display.bounds), 0);
        }

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