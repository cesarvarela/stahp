import { app, BrowserWindow, ipcMain } from "electron"
import path from 'path'
import { IThemePackage, IThemesSettings } from "./interfaces"
import Settings from "./Settings"
import fetch from "node-fetch"
import { promises as fs, constants as FSCONSTANTS } from 'fs';

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

    async search(query: string): Promise<IThemePackage[]> {

        const libnpmsearch = require('libnpmsearch')
        const results: IThemePackage[] = await libnpmsearch(`stahp-theme-${query}`)

        for (const result of results) {

            if (this.isDownloaded(result.name)) {
                result.downloaded = await this.isDownloaded(result.name)
            }
        }

        return results
    }

    async download(name: string) {

        let result = null

        try {

            const themeFolder = path.join(this.getThemesFolder(), name)
            const tarballPath = await this.downloadPackage(name)
            result = await this.extractPackage(tarballPath, themeFolder)

        } catch (err) {

            console.log(err)
        }

        return result
    }

    private getThemesFolder(): string {

        return path.join(app.getPath("userData"), 'themes')
    }

    private async isDownloaded(name: string): Promise<boolean> {

        const themeFolder = path.join(this.getThemesFolder(), name)
        let result = true

        try {

            await fs.access(themeFolder, FSCONSTANTS.F_OK)
        }
        catch {

            result = false
        }

        return result
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

            tar.x({
                file: tarball, cwd: where, strip: 1, filter: (path: string) => {

                    if (path.startsWith('package/dist') || path === 'package/package.json') {

                        return true
                    }

                    return false
                }
            },
                (err: any, files: any) => {

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