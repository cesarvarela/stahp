import { nativeTheme } from "electron";
import { IGeneralSettings, Theme } from "./interfaces";
import Settings from "./Settings";

export default class General {

    private settings: Settings<IGeneralSettings> = null

    async setup() {

        const [instance, values] = await Settings.create<IGeneralSettings>('general', { theme: nativeTheme.shouldUseDarkColors ? "dark" : "light" })

        this.settings = instance
        
        console.log(values)
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