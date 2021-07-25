import { app, BrowserWindow, ipcMain } from "electron"
import path from 'path'
import { IThemesSettings } from "./interfaces"
import Settings from "./Settings"
import fetch from "node-fetch"

export default class Themes {

    settings: Settings<IThemesSettings> = null

    async setup() {

        const [instance] = await Settings.create<IThemesSettings>('themes', {
            theme: 'default',
        })

        this.settings = instance

        ipcMain.handle('getThemesSettings', async () => {
            const settings = await this.settings.get()
            return settings
        })

        ipcMain.handle('searchThemes', async (_, query: string) => {

            const res = await this.search(query)

            return res
        })

        ipcMain.handle('downloadTheme', async (_, name) => {

            const res = await this.download(name)

            return res
        })
    }

    async search(query: string) {

        const libnpmsearch = require('libnpmsearch')

        const res = await libnpmsearch(`stahp-theme-${query}`)
        return res
    }

    async download(name: string) {

        const fs = require('fs')

        try {

            const themeFolder = path.join(app.getPath("userData"), 'themes', name)

            if (!fs.existsSync(themeFolder)) {
                fs.mkdirSync(themeFolder, { recursive: true })
            }

            const tarballPath = await this.downloadPackage(name)

            await this.extractPackage(tarballPath, themeFolder)

        } catch (err) {

            console.log(err)
        }
    }

    private async downloadPackage(name: string): Promise<string> {

        const theme: any = await (await fetch(`https://registry.npmjs.org/${name}/`)).json()
        const latest = theme['dist-tags'].latest
        const tarballURL = theme.versions[latest].dist.tarball

        const { download } = require('electron-dl')

        const window = BrowserWindow.getFocusedWindow();
        const result = await download(window, tarballURL)

        return result.savePath
    }

    private async extractPackage(tarball: string, where: string) {

        const tar = require('tar')

        return new Promise((resolve, reject) => {

            tar.x({ file: tarball, cwd: where, strip: 2 }, ['package/dist'], (err: any, files: any) => {

                if (err) {
                    reject(err)
                }
                else {
                    resolve(files)
                }
            })
        })
    }

    async getLongBreakURL() {
        const settings = await this.settings.get()
        return settings.theme === 'default'
            ? path.join(__dirname, 'themes', 'default', 'long.html')
            : 'Not implemented'
    }
}