// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = require('electron')
const remote = electron.remote
const dialog = electron.dialog
const mainProcess = remote.require('./main')
const fileWatcher = require('chokidar')
document.getElementById('fileNavigator').addEventListener('click', _ => {
  mainProcess.selectDirectory()
})
