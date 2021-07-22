import { ipcMain, nativeTheme } from "electron";
import { IGeneralSettings } from "./interfaces";
import Settings from "./Settings";

export default class General {

    private settings: Settings<IGeneralSettings> = null

    async setup() {

        const [instance] = await Settings.create<IGeneralSettings>('general', { theme: nativeTheme.shouldUseDarkColors ? "dark" : "light" })

        this.settings = instance

        ipcMain.handle('getGeneralSettings', async () => {

            return this.settings.get();
        })
    }

    async toggleTheme() {

        const settings = await this.settings.get()

        if (settings.theme == 'dark') {

            await this.settings.set({ ...settings, theme: 'light' })
        }
        else {

            await this.settings.set({ ...settings, theme: 'dark' })
        }
    }

    async getTheme() {

        return (await this.settings.get()).theme;
    }
}