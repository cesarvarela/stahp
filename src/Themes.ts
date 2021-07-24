import { ipcMain } from "electron";
import { Octokit } from 'octokit';
import path from 'path';
import { IThemesSettings } from "./interfaces";
import Settings from "./Settings";

export default class Themes {

    private octokit: Octokit = null
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

        const { Octokit } = require('octokit')
        this.octokit = new Octokit({
            userAgent: 'stahp/v0.1',
        })
    }

    async getLongBreakURL() {
        const settings = await this.settings.get()
        return settings.theme === 'default'
            ? path.join(__dirname, 'themes', 'default', 'long.html')
            : 'Not implemented'
    }

    async downloadTheme() {
        const repo = await this.octokit.rest.repos.downloadArchive({ owner: `cesarvarela`, repo: `stahp-default`, ref: 'master' })
        //TODO: unzip and stuff here
    }
}