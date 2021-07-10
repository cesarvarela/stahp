import { powerMonitor, powerSaveBlocker, ipcMain } from "electron";
import { Octokit } from 'octokit';

export default class Themes {

    private octokit: Octokit = null

    async setup() {
        const { Octokit } = require('octokit')
        this.octokit = new Octokit({
            userAgent: 'stahp/v0.1',
        })
    }

    async downloadTheme() {
        const repo = await this.octokit.rest.repos.downloadArchive({ owner: `cesarvarela`, repo: `stahp-default`, ref: 'master' })
        //TODO: unzip and stuff here
    }
}