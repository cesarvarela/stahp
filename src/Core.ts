import { Tray, Menu, app, BrowserWindow, ipcMain, screen, shell, nativeTheme } from 'electron'
import path from 'path'
import storage from 'electron-json-storage'
import { Display } from 'electron/main';
import Activity from './Activity';
import Scheduler from './Scheduler';
import Themes from './Themes';
import General from './General';
import { fadeWindowIn, fadeWindowOut } from './Fade';

declare const SETTINGS_WEBPACK_ENTRY: string;
declare const SETTINGS_PRELOAD_WEBPACK_ENTRY: string;

declare const BLOCKER_WEBPACK_ENTRY: string;
declare const BLOCKER_PRELOAD_WEBPACK_ENTRY: string;

class Core {

    private settingsWindow: BrowserWindow = null
    private tray: Tray = null
    private windows: BrowserWindow[] = []
    private scheduler: Scheduler = null
    private activity: Activity = null
    private themes: Themes = null
    private General: General = null

    async init() {
        await this.setupgGeneral()
        await this.setupTray()
        await this.setupIpc()
        await this.openSettingsWindow()

        await this.setupActivity()
        await this.setupThemes()
    }

    setupgGeneral() {
        this.General = new General()
        this.General.setup()
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

    setupActivity() {

        this.activity = new Activity(() => this.startLongBreak(), () => this.endLongBreak())

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

        ipcMain.handle('takeLongBreak', (_, options: { theme?: string } = {}) => this.startLongBreak(options))

        ipcMain.handle('skipBreak', async () => this.endLongBreak({ isSkip: true }))

        ipcMain.handle('takeIndefiniteBreak', () => {

            this.activity.stop()

            this.block()
        })

        ipcMain.handle('openDevTools', async (e) => {

            e.sender.openDevTools()
        })
    }

    startLongBreak = async ({ theme }: { theme?: string } = {}) => {

        let selectedTheme = theme

        if (!theme) {

            const { theme } = await this.activity.settings.get()
            selectedTheme = theme
        }

        this.activity.longBreak()
        this.block({ theme: selectedTheme })
    }

    endLongBreak = async ({ isSkip = false, resume = true }: { isSkip?: boolean, resume?: boolean } = {}) => {

        this.activity.stop()
        this.unblock()

        if (resume) {
            this.activity.start()
        }
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

    async block({ theme = 'stahp-theme-default', frame = false }: { theme?: string, frame?: boolean } = null) {

        await this.unblock()

        const displays = screen.getAllDisplays()

        for (const display of displays) {
            const window = await this.openBlockerWindow({ display, theme, frame })
            this.windows.push(window)
        }
    }

    async openBlockerWindow({ display, theme, frame }: { display: Display, theme: string, frame: boolean }) {

        const window = new BrowserWindow({
            ...display.bounds,
            frame: frame || theme === 'development',
            skipTaskbar: true,
            enableLargerThanScreen: true,
            opacity: 0,
            backgroundColor: nativeTheme.shouldUseDarkColors ? '#333' : '#ddd',
            webPreferences: {
                preload: BLOCKER_PRELOAD_WEBPACK_ENTRY
            },
        });

        if (theme && theme == "development") {

            window.loadURL('http://localhost:1234')

        } else {

            const file = await this.themes.getLongBreakURL({ theme })

            window.loadFile(file)

            window.setAlwaysOnTop(true, "screen-saver")
            //TODO: https://github.com/electron/electron/issues/10862
            setTimeout(() => window.setBounds(display.bounds), 0);
            setTimeout(() => window.setBounds(display.bounds), 0);
            setTimeout(() => window.setBounds(display.bounds), 0);
            setTimeout(() => window.setBounds(display.bounds), 0);
        }

        await new Promise((resolve) => {
            window.once('ready-to-show', resolve)
        })

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
                backgroundColor: nativeTheme.shouldUseDarkColors ? '#333' : '#ddd',
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