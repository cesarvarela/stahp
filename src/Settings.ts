import storage from './storage'

class Settings<T extends Record<string, unknown>> {

    private key: string = null
    private defaults: T = {} as T

    constructor(key: string, defaults: T) {
        this.key = key
        this.defaults = defaults
    }

    static async create<Y extends Record<string, unknown>>(key: string, defaults: Y): Promise<[Settings<Y>, Y]> {

        const instance = new Settings(key, defaults)
        const values = await instance.load()

        return [instance, values]
    }

    private async load() {

        let value = {}

        if (await storage.has(this.key)) {

            value = await storage.get(this.key)
        }

        return storage.set(this.key, { ...this.defaults, ...value })
    }

    async set(data: T): Promise<T> {

        return storage.set(this.key, data)
    }

    async get(): Promise<T> {

        return storage.get(this.key)
    }
}

export default Settings