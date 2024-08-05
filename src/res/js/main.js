process.env.NODE_ENV = 'UTF-8';
process.env["NodeJS_Global"] = true;
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const {app, BrowserWindow, ipcMain, shell, dialog} = require('electron');
const {EventEmitter} = require("events");
const path = require('path');
const fs = require('fs');
const original_fs = require('original-fs');
const asar = require("asar");
const vm = require('vm');

let mainwindow;

const window_width = 812;
const window_height = 470;

let AppConfig = null;

const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(Number.MAX_SAFE_INTEGER);

process.on("exit", (code) => {
    setInterval(function () {
    }, 1000 * 1000 * 1000);
    eventEmitter.emit("AppExit", code);
    clearInterval(void 0);
    process.exit(0);
});
process.on("uncaughtException", (error, origin) => {
    logger.error("MAIN", "ERROR!!\n", error, "\n\n", "Origin: ", origin);
    setTimeout(function () {
        process.exit(0);
    }, 5000);
});

const WaitCodeExecuteFinish = (code) => {
    return new Promise((resolve, reject) => {
        try {
            vm.runInNewContext(code, {
                registryEventListener, getLogger, exitApp, loadCustomConfig, loadConfig, Logger, getMainWindow, getDefaultWindowSize,
            });
            resolve();
        } catch (err) {
            reject(err);
        }
    });
};

// Return [width, height]
function getDefaultWindowSize() {
    return [window_width, window_height];
}

// 退出App
function exitApp(code) {
    eventEmitter.emit("AppExit");
    app.exit(code);
    process.exit(code);
}

// 注册事件函数
function registryEventListener(event, func, options = {once: false}) {
    if (!options.once) {
        eventEmitter.on(event, func)
    } else {
        eventEmitter.once(event, func);
    }
}

// 加载App配置文件
function loadConfig() {
    original_fs.readFile("config/app.json", "utf8", (err, data) => {
        if (err) {
            logger.error("MAIN", "Failed to read app config file 'config/app.json'\n", err);
            return;
        }
        try {
            AppConfig = JSON.parse(data);
        } catch (err) {
            logger.error("MAIN", "Failed to read app config file 'config/app.json'\n", err);
        }
    });
}

// 加载自定义配置文件
function loadCustomConfig(file_name) {
    return new Promise((resolve, reject) => {
        original_fs.readFile("config/" + file_name, "utf8", (err, data) => {
            if (err) {
                logger.error("MAIN", `Failed to read app config file 'config/${file_name}'\n`, err);
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

let unregistered = {
    "renderer_js_before": [],
    "renderer_js_after": [],
    "css": []
};

const LangList = ["中文"];
const DefaultLangText = {};
let NowLangText = {};

function concatAllStr(arrs) {
    return arrs.reduce((acc, cur) => acc.toString().concat(cur), []);
}

// 日志
class Logger {
    constructor(target) {
        this.protoType = null;
        this.target = target;
    }

    info(name, ...s) {
        this.target["info"](`[INFO][${name}]${concatAllStr(s)}`);
    }

    warn(name, ...s) {
        this.target["warn"](`[WARN][${name}]${concatAllStr(s)}`);
    }

    error(name, ...s) {
        this.target["error"](`[ERROR][${name}]${concatAllStr(s)}`);
    }

    debug(name, ...s) {
        this.target["debug"](`[DEBUG][${name}]${concatAllStr(s)}`);
    }

    log(type, name, ...s) {
        this.target["info"](`[${type}][${name}]${concatAllStr(s)}`);
    }
}

const logger = new Logger(console);
const LoadedPluginList = [];

function getLogger() {
    return logger;
}

function getMainWindow() {
    return mainwindow;
}

// 主函数
function main() {
    process.chdir(path.dirname(app.getPath("exe")));
    // 主窗口创建器
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
                sandbox: false,
                preload: path.join(__dirname, './preload.js')
            }
        });
        mainwindow.webContents.openDevTools();
        mainwindow.loadFile("./index.html").then(r => {
        });
    };

    // 初始化IPC监听
    function initIPCHandler() {
        ipcMain.handle("CloseApp", () => {
            mainwindow.close();
            exitApp(0);
        });
        ipcMain.handle("HideWindow", () => mainwindow.minimize());
        ipcMain.handle("OpenDevTools", () => mainwindow.webContents.openDevTools({mode: "detach"}));
        ipcMain.handle("CloseDevTools", () => mainwindow.webContents.closeDevTools());
        ipcMain.on("ReloadAppConfig", (event, args) => {
            loadConfig();
            event.reply("_UpdateAppConfig", AppConfig);
        });
        ipcMain.on("OpenURLByDefaultBrowser", (event, args) => {
            shell.openExternal(args[0]);
        });
        ipcMain.on("GetBeforeLoadScript", (event) => {
            event.reply("GetBeforeLoadScriptBack", {c: unregistered.renderer_js_before});
        });
        ipcMain.on("GetAfterLoadScript", (event) => {
            event.reply("GetAfterLoadScriptBack", {c: unregistered.renderer_js_after});
        });
        ipcMain.on("GetCSS", (event) => {
            event.reply("GetCSSBack", {c: unregistered.css});
        });
    }

    app.whenReady()
        .then(() => { // App PreInit
            logger.info("MAIN", "Start pre-initialization");
            loadConfig();
            initIPCHandler();
            logger.info("MAIN", "Pre-initialization completed");
        })
        .then(() => { // 开始加载插件
            logger.info("MAIN", "Start load plugin");
            return new Promise((resolve, reject) => {
                original_fs.readdir("plugin", (err, files) => {
                    if (err) {
                        console.error(err);
                        dialog.showMessageBox({
                            type: "error",
                            title: "错误：读取插件目录失败",
                            message: err.toString()
                        });
                        exitApp(0);
                        reject(err);
                        return;
                    }

                    let plugins = files.filter(s => s.endsWith(".asar"));
                    if (plugins.length >= 1) {
                        logger.info("PluginLoader", "Found plugin files: ", (() => {
                            let s = "";
                            for (const l of plugins) {
                                s += `\n    ${l}`;
                            }
                            return s;
                        })());
                        try {
                            Promise.all(plugins.map(async file => {
                                let plugin_path = `plugin\\${file}`;
                                let manifestPath = `${plugin_path}/manifest.json`;
                                let manifestExists = await new Promise(resolve => {
                                    fs.exists(manifestPath, resolve);
                                });
                                if (!manifestExists) {
                                    logger.error("PluginLoader", `Missing file 'manifest.json' in plugin file '${plugin_path}'`);
                                    throw new Error(`Missing file 'manifest.json' in plugin file '${plugin_path}'`);
                                }
                                let manifestData = await new Promise((resolve, reject) => {
                                    fs.readFile(manifestPath, "utf-8", (err, data) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve(JSON.parse(data));
                                        }
                                    });
                                });
                                let error = false;
                                if (Boolean(manifestData.resource)) {
                                    await new Promise(resolve => {
                                        fs.exists("plugin\\extracted_temp\\"+file, e => {
                                            if (!e) {
                                                original_fs.mkdir("plugin\\extracted_temp\\"+file);
                                                // todo
                                            }
                                        });
                                    });
                                }
                                if (Boolean(manifestData.css)) {
                                    await Promise.all(manifestData.css.map(async file => {
                                        const cssCode = await new Promise((resolve, reject) => {
                                            fs.readFile(path.join(plugin_path, file).toString(), "utf-8", (err, data) => {
                                                if (err) {
                                                    reject(err);
                                                }else {
                                                    resolve(data);
                                                }
                                            });
                                        });
                                        unregistered.css.push(cssCode);
                                    }));
                                }
                                if (Boolean(manifestData.js)) {
                                    if (manifestData.js.main) {
                                        try {
                                            const code = await new Promise((resolve, reject) => {
                                                fs.readFile(plugin_path + "\\" + manifestData.js.main, "utf-8", (err, code) => {
                                                    if (err) {
                                                        reject(err);
                                                    } else {
                                                        resolve(code);
                                                    }
                                                });
                                            });
                                            await WaitCodeExecuteFinish(code);
                                        } catch (err) {
                                            logger.error("PluginLoader", `Error in main script. Plugin: ${plugin_path}\n`, err.toString());
                                            error = true;
                                        }
                                    }
                                    if (Boolean(manifestData.js.renderers)) {
                                        await Promise.all(manifestData.js.renderers.map(async fobj => {
                                            const code = new Promise((resolve, reject) => {
                                                console.log(path.join(plugin_path, fobj.path).toString())
                                                fs.readFile(path.join(plugin_path, fobj.path).toString(), "utf-8", (err, code) => {
                                                    if (err) {
                                                        reject(err);
                                                    }else {
                                                        resolve(code);
                                                    }
                                                });
                                            });
                                            code.then(r => {
                                                switch (fobj.loadin) {
                                                    case "before":
                                                        unregistered.renderer_js_before.push(r);
                                                        break;
                                                    case "after":
                                                        unregistered.renderer_js_after.push(r);
                                                        break;
                                                }
                                            });
                                        }));
                                    }
                                }
                                if (!error) {
                                    LoadedPluginList.push({
                                        name: manifestData.name,
                                        version: manifestData.version,
                                        description: manifestData.description,
                                        id: manifestData.id
                                    });
                                    logger.info("PluginLoader", `Loaded plugin '${manifestData.name} ${manifestData.version}'`);
                                } else {
                                    logger.error("PluginLoader", `Failed load plugin '${plugin_path}'`);
                                }
                            })).then(r => {
                                resolve();
                            });
                        } catch (err) {
                            logger.error("PluginLoader", "Failed to load plugins. Reason: ", err);
                            reject(err);
                        }
                    } else {
                        logger.info("PluginLoader", "No plugin files found.");
                        resolve();
                    }
                });
            });
        })
        .then(() => { // App Init
            logger.info("MAIN", "Plugin load completed");
            logger.info("MAIN", "Start init");
            eventEmitter.emit("AppInit");
        }).then(() => {
            logger.info("MAIN", "Init complete");
            logger.info("MAIN", "Start loading the UI");
            create();
            app.on('activate', () => {
                if (BrowserWindow.getAllWindows().length === 0) {
                    create();
                }
            });
            logger.info("MAIN", "UI load complete");
        }).catch((reason) => {
            logger.error("MAIN", reason);
            dialog.showMessageBox({
                type: "error",
                title: "错误",
                message: reason.toString()
            }).then(() => exitApp(0));
        });
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })
}

main();
