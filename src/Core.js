import { Tray, Menu, app, BrowserWindow, ipcMain, screen, shell } from 'electron'
import path from 'path'
import storage from 'electron-json-storage'

class Core {
    constructor() {
        this.settingsWindow = null
        this.tray = null
        this.blockerWindows = []
    }

    async init() {
        await this.setupStorage()
        await this.setupTray()
        await this.setupIpc()
        await this.openSettingsWindow()
    }

    setupTray() {

        this.tray = new Tray(path.join(__dirname, 'pause.png'));

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

        if (!await this.hasSetting({ key: 'settings' })) {
            await this.setSetting({ key: 'settings', data: {} })
        }
    }

    setupIpc() {

        ipcMain.handle('close', async (e) => {
            e.sender.destroy()
        })
    }

    async unblock() {

        for (const window of this.blockerWindows) {

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
            const window = this.openBlockerWindow({ display })
            this.windows.push(window)
        }
    }

    async openBlockerWindow({ display }) {
        // Create the browser window.
        const window = new BrowserWindow({
            ...display.bounds,
            frame: false,
            skipTaskbar: true,
            webPreferences: {
                preload: BLOCKER_PRELOAD_WEBPACK_ENTRY
            },
        });

        window.setAlwaysOnTop(true, "screen-saver")
        window.loadURL(BLOCKER_WEBPACK_ENTRY)

        //TODO: https://github.com/electron/electron/issues/10862
        setTimeout(() => window.setBounds(display.bounds), 0);
        setTimeout(() => window.setBounds(display.bounds), 0);
        setTimeout(() => window.setBounds(display.bounds), 0);
        setTimeout(() => window.setBounds(display.bounds), 0);

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
                icon: path.join(__dirname, 'pause.png'),
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

    async setSetting({ key, data }) {

        return new Promise((resolve, reject) => {

            storage.set(key, data, (err) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve()
                }
            })
        })
    }

    async hasSetting({ key }) {

        return new Promise((resolve, reject) => {

            storage.has(key, (err, hasKey) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(hasKey)
                }
            })
        })
    }

    async getSetting({ key }) {

        return new Promise((resolve, reject) => {

            storage.get(key, (err, data) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(data)
                }
            })
        })
    }

}

export default Core