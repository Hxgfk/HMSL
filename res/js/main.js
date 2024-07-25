const {app, BrowserWindow, ipcMain, shell} = require('electron');
const path = require('node:path');

let win;

const window_width = 812;
const window_height = 470;

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
const create = function () {
    win = new BrowserWindow({
        icon: path.join(__dirname, '../img/appicon/icon.png'),
        width: window_width,
        height: window_height,
        minWidth: window_width,
        minHeight: window_height,
        resizable: false,
        frame: false,
        transparent: true,
        backgroundColor: '#00000000',
        webPreferences: {
            devTools: true,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
            enableRemoteModule: true,
            sandbox: true,
            preload: path.join(__dirname, './preload.js')
        }
    });
    win.webContents.openDevTools();
    win.loadFile("index.html").then(r => {});
}

function initIPCHandler() {
    ipcMain.handle("CloseWindow", () => {
        win.close();
        app.exit(0);
    });
    ipcMain.handle("HideWindow", () => win.minimize());
    ipcMain.handle("OpenDevTools", () => win.webContents.openDevTools());
    ipcMain.handle("CloseDevTools", () => win.webContents.closeDevTools());
    ipcMain.on("GetAppConfig", (event, args) => {
        let data;
        data = {
            appVersion: "1.0.0",
            general: {
                animation: true,
                animation_time: "0.2s"
            }
        };
        event.reply("GetAppConfigBack", data);
    });
    ipcMain.on("OpenURLByDefaultBrowser", (event, args) => {
        shell.openExternal(args[0]);
    });
}

app.whenReady().then(() => {
    create();
    initIPCHandler();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            create();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})