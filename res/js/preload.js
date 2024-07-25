const {ipcRenderer, shell} = require("electron");
window.dep = (()=>{
    return {
        "ipcRenderer": ipcRenderer,
        "shell": shell
    };
})();