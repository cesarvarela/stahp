import storage from 'electron-json-storage'
import { ISetting } from './interfaces'

class Settings {

    async setSetting<T extends unknown>({ key, data }: { key: string, data: T }): Promise<boolean> {

        return new Promise((resolve, reject) => {

            storage.set(key, data as never, (err: Error) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(true)
                }
            })
        })
    }

    async hasSetting({ key }: ISetting): Promise<boolean> {

        return new Promise((resolve, reject) => {

            storage.has(key, (err: Error, hasKey: boolean) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(hasKey)
                }
            })
        })
    }

    async getSetting<T extends unknown>({ key }: ISetting): Promise<T> {

        return new Promise((resolve, reject) => {

            storage.get(key, (err: Error, data: never) => {
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

export default Settings