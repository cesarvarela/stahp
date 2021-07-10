import storage from 'electron-json-storage'

class Settings<T extends Record<string, unknown>> {

    private key: string = null
    private defaults: T = {} as T

    constructor(key: string, defaults: T) {
        this.key = key
        this.defaults = defaults
    }

    async set(data: T): Promise<T> {

        return new Promise((resolve, reject) => {

            storage.set(this.key, { ...this.defaults, ...data as T }, (err: Error) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(data)
                }
            })
        })
    }

    async get(): Promise<T> {

        return new Promise((resolve, reject) => {

            storage.get(this.key, (err: Error, data: any) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve({ ...this.defaults, ...data })
                }
            })
        })
    }
}

export default Settings