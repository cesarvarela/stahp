import { app, session } from 'electron'
import Core from './Core'
import * as Sentry from "@sentry/electron"

Sentry.init({ dsn: "https://0a6134a5d89d40c4954c6144b0e63c64@o944978.ingest.sentry.io/5893671" });

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let core = null

app.on('ready', async () => {
  core = new Core()
  await core.init()

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'unsafe-inline' 'self' 'unsafe-eval' data: *.sentry.io *.cloudfront.net",
        ]
      }
    })
  })
});

app.on('window-all-closed', () => {

})
