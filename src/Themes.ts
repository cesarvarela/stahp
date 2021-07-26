import { app, BrowserWindow, ipcMain } from "electron"
import path from 'path'
import { IThemePackage, IThemesSettings } from "./interfaces"
import Settings from "./Settings"
import fetch from "node-fetch"
import { promises as fs, constants as FSCONSTANTS } from 'fs';

export default class Themes {

    settings: Settings<IThemesSettings> = null

    async setup() {

        const [instance] = await Settings.create<IThemesSettings>('themes', {})

        this.settings = instance

        ipcMain.handle('getThemesSettings', async () => {
            const settings = await this.settings.get()
            return settings
        })

        ipcMain.handle('getDownloadedThemes', async () => {
            const themes = await this.getDownloadedThemes()
            return themes
        })

        ipcMain.handle('searchThemes', async (_, query: string) => {

            const res = await this.search(query)
            return res
        })

        ipcMain.handle('downloadTheme', async (_, name) => {

            const res = await this.download(name)
            return res
        })

        ipcMain.handle('deleteTheme', async (_, name) => {

            const res = await this.delete(name)
            return res
        })
    }

    async getDownloadedThemes(): Promise<IThemePackage[]> {

        const themesFolder = this.getThemesFolder()
        const themes: IThemePackage[] = []
        const files = await fs.readdir(themesFolder, { withFileTypes: true })

        for (const dir of files.filter(f => f.isDirectory())) {

            const blob = await fs.readFile(path.join(themesFolder, dir.name, 'package.json'), 'utf8')
            const packageJson = JSON.parse(blob)

            packageJson.status = 'downloaded'

            themes.push(packageJson)
        }

        themes.push({ name: 'stahp-theme-default', version: 'latest', publisher: { email: 'mail@cesarvarela.com', username: 'cesarvarela' }, status: 'downloaded' })

        return themes
    }

    async search(query: string): Promise<IThemePackage[]> {

        const libnpmsearch = require('libnpmsearch')
        const results: IThemePackage[] = await libnpmsearch(`stahp-theme-${query}`)

        const availables: IThemePackage[] = []

        for (const result of results) {

            if (!(await this.isDownloaded(result.name)) && result.name != 'stahp-theme-default') {

                availables.push({ ...result, status: 'available' })
            }
        }

        return availables
    }

    async download(name: string) {

        let result = null

        try {
            const themeFolder = path.join(this.getThemesFolder(), name)
            const tarballPath = await this.downloadPackage(name)
            result = await this.extractPackage(tarballPath, themeFolder)

        } catch (err) {

            console.log('weee', err)
        }

        return result
    }

    async delete(name: string): Promise<boolean> {

        try {

            await fs.rmdir(path.join(this.getThemesFolder(), name), { recursive: true })
        }
        catch (e) {
            console.log(e)
            return false
        }

        return true
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

        try {

            await fs.access(where, FSCONSTANTS.F_OK)

        } catch (e) {

            await fs.mkdir(where, { recursive: true })
        }

        const tar = require('tar')

        return new Promise((resolve, reject) => {

            tar.x({
                file: tarball, cwd: where, strip: 1, filter: (path: string) => path.startsWith('package/dist') || path === 'package/package.json'
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

    async getLongBreakURL({ theme }: { theme: string }): Promise<string> {

        const base = theme == 'stahp-theme-default'
            ? path.join(__dirname, 'themes')
            : this.getThemesFolder()

        const url = path.join(base, theme, 'dist', 'long.html')

        return url
    }
}