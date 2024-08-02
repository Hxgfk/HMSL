const {app, BrowserWindow, ipcMain, shell, dialog} = require('electron');
const path = require('path');
const fs = require('fs');
const original_fs = require('original-fs');

let mainwindow;

const window_width = 812;
const window_height = 470;

process.chdir(path.dirname(app.getPath("exe")));
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
const create = function () {
    mainwindow = new BrowserWindow({
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
    mainwindow.webContents.openDevTools();
    mainwindow.loadFile("./index.html").then(r => {});
}

let AppConfig = null;

function exitApp(code) {
    app.exit(code);
    process.exit(code);
}

function initIPCHandler() {
    ipcMain.handle("CloseApp", () => {
        mainwindow.close();
        exitApp(0);
    });
    ipcMain.handle("HideWindow", () => mainwindow.minimize());
    ipcMain.handle("OpenDevTools", () => mainwindow.webContents.openDevTools({mode: "detach"}));
    ipcMain.handle("CloseDevTools", () => mainwindow.webContents.closeDevTools());
    ipcMain.on("GetAppConfig", (event, args) => {
        original_fs.readFile("appconfig.json", "utf8", (err, data) => {
            if (err) {
                console.error(err);
                mainwindow.hide();
                dialog.showMessageBox({
                    type: "error",
                    title: "错误：读取配置文件失败",
                    message: err.toString()
                }).then(() => exitApp(0));
                return;
            }
            try {
                AppConfig = JSON.parse(data);
            }catch (err) {
                console.error(err);
                mainwindow.hide();
                dialog.showMessageBox({
                    type: "error",
                    title: "错误：读取配置文件失败",
                    message: err.toString()
                }).then(() => exitApp(0));
            }
            event.reply("GetAppConfigBack", AppConfig);
        })
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