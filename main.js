const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const fileWatcher = require('chokidar')

const dialog = electron.dialog

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function selectDirectory() {
  dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

exports.selectDirectory = function () {
  dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  },function(dirPath){
    if(dirPath){
        // Start to watch the selected path
        function startWatcher(dirPath) {
          var watcher = fileWatcher.watch(dirPath, {
            ignored: /[\///]\./,
            persistent: true
          })

          function onWatcherReady() {
            console.info('Now watching for changes')
          }

          watcher.on('add', function(filePath) {
            var str = filePath;
            var n = str.lastIndexOf('/');
            var fileName = str.substring(n + 1);
            if (fileName.includes('AFE')) {
              console.log('The AFE file: ', path, 'has been added.')
              fileWindow = new BrowserWindow({width: 600, height: 400})
              fileWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'new_file.html'),
                protocol: 'file:',
                slashes: true
              }))

              fileWindow.on('closed', function () {
                // Dereference the window object, usually you would store windows
                // in an array if your app supports multi windows, this is the time
                // when you should delete the corresponding element.
                fileWindow = null
              })
            } else {
              console.log('File', path, 'has been added to directory')
            }
          })
          .on('ready', onWatcherReady)
          .on('raw', function (event, path, details) {
            console.log('Raw event info', event, path, details);
          })
          .on('error', function (error) {
            console.log('Oops there was an error', error);
          })
        };

        startWatcher(dirPath[0]);
    } else {
        console.log("No path selected");
    }
  });
}


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
