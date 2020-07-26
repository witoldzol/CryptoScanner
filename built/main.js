var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow;
var ipcMain = require('electron').ipcMain;
var luno = require('./luno.js');
var binance = require('./binance.js');
var gdax = require('./gdax.js');
var marketService = require('./marketService.js');
var util = require('./util');
var graph = require('./graph.js');
// // Keep a global reference of the window object, if you don't, the window will
// // be closed automatically when the JavaScript object is garbage collected.
// let mainWindow
// function createWindow() {
//     // Create the browser window.
//     mainWindow = new BrowserWindow({ width: 800, height: 800 })
//     // and load the index.html of the app.
//     mainWindow.loadFile('./renderer/app.html')
//     // Emitted when the window is closed.
//     mainWindow.on('closed', function () {
//         // Dereference the window object, usually you would store windows
//         // in an array if your app supports multi windows, this is the time
//         // when you should delete the corresponding element.
//         mainWindow = null
//     })
// }
// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.on('ready', createWindow)
// // Quit when all windows are closed.
// app.on('window-all-closed', function () {
//     // On OS X it is common for applications and their menu bar
//     // to stay active until the user quits explicitly with Cmd + Q
//     if (process.platform !== 'darwin') {
//         app.quit()
//     }
// })
// app.on('activate', function () {
//     // On OS X it's common to re-create a window in the app when the
//     // dock icon is clicked and there are no other windows open.
//     if (mainWindow === null) {
//         createWindow()
//     }
// })
// // ================================================== SCAN 
// //perform scan when receive message from renderer
// ipcMain.on('scan-button-clicked', (event, arg) => {
// let lunoPrices = marketService.getPrices(luno.options)
var gdaxPrices = marketService.getPrices(gdax.options);
var binancePrices = marketService.getPrices(binance.options);
// let stagerSendObject = obj => {
//     event.sender.send('scan-data', JSON.stringify(obj))
// }
// RESOLVE ALL REQUESTS
// Promise.all([lunoPrices, gdaxPrices, binancePrices])
Promise.all([gdaxPrices, binancePrices])
    .then(function (data) { return util.mapDataToObject(data); })
    .then(function (data) { console.log(' MAIN \n' + JSON.stringify(data)); return data; })
    .then(function (data) { return graph.buildGraph(data); })
    .catch(function (e) { return console.log('error from main pricess ALL.Promise: ' + e.stack); });
// })
