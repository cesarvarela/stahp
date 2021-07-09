const { app } = require('electron');

import Core from './Core'

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
