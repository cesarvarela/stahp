import { app } from 'electron'
import * as Sentry from "@sentry/electron/dist/main"
import Core from './Core'

Sentry.init({ dsn: "https://523e1f89c8f54baf8788cfe2dee8df51@o944978.ingest.sentry.io/5893540" })

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let core = null

app.on('ready', async () => {
  core = new Core()
  await core.init()
  // await core.downloadTheme()
  // await core.block()
});

app.on('window-all-closed', () => {

})
