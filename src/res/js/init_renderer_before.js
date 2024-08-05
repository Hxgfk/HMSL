window.dep.ipcRenderer.send("HTMLPreInit");
window.dep.ipcRenderer.send("GetBeforeScripts");

let AppConfig = null;
window.dep.ipcRenderer.on('_UpdateAppConfig', async (event, data) => {
    AppConfig = data;
});
window.dep.ipcRenderer.send("ReloadAppConfig");
window.dep.ipcRenderer.send("GetCSS");
window.dep.ipcRenderer.on("GetCSSBack", async (event, data) => {
    for (const c of data.c) {
        let e = document.createElement("style");
        e.innerHTML = c;
        document.head.appendChild(e);
    }
    console.log("CSS Load Success");
});
window.dep.ipcRenderer.send("GetBeforeLoadScript");
window.dep.ipcRenderer.on('GetBeforeLoadScriptBack', async (event, data) => {
    for (const c of data.c) {
        let e = document.createElement("script");
        e.innerHTML = c;
        document.head.appendChild(e);
    }
    console.log("Before Script Load Success");
});

document.addEventListener("DOMContentLoaded", () => {
    for (const page_obj of unregistered_page) {
        const pagediv = document.createElement("div");
        pagediv.id = page_obj.id;
        pagediv.classList.add("body_cont");
        pagediv.style.display = "none";
        pagediv.innerHTML = page_obj.elementtext;
        main_cont.appendChild(pagediv);
        defaultElementDisplayMode[page_obj.id] = page_obj.maincontainer_display_mode;
        PageContainers[page_obj.id] = pagediv;
        let content_ontainer = page_obj.contentcontainer_animation;
        if (content_ontainer != null) {
            PageContainerElements[page_obj.id] = page_obj.contentcontainer_animation;
        }else {
            PageContainerElements[page_obj.id] = [];
        }
    }
});
