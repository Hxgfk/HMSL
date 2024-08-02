function hideWindow() {
    window.dep.ipcRenderer.invoke('HideWindow');
}

function closeWindow() {
    window.dep.ipcRenderer.invoke('CloseApp');
}

function goToGithub() {
    window.dep.ipcRenderer.send("OpenURLByDefaultBrowser", ['https://github.com/Hxgfk/HMSL',])
}

let AppConfig = null;
(async () => {
    window.dep.ipcRenderer.on('GetAppConfigBack', async (event, data) => {
        AppConfig = data;
    });
})();
const topicon = document.getElementById("appicon");
const topname = document.getElementById("top_name");
const main_cont = document.getElementById("bodydiv");
const defaultElementDisplayMode = {
    mainpage: "block",
    sever_list: "flex",
    sever_setting: "flex"
}
let currentPage = "mainpage";
const mainpage = document.getElementById('mainpage');
const sever_list = document.getElementById('sever_list');
const sever_setting = document.getElementById('sever_setting');

const PageContainers = {
    "mainpage": mainpage,
    "sever_list": sever_list,
    "sever_setting": sever_setting
};

const PageContainerElements = {
    "mainpage": [
        {
            elm: document.getElementById("selectlist"),
            direction: "left"
        },
        {
            elm: document.getElementById("runbutton_cont"),
            direction: "right"
        }
    ],
    "sever_list": [
        {
            elm: document.getElementById("sever_folder_list_leftbar"),
            direction: "left"
        },
        {
            elm: document.getElementById("sever_folder_list_main"),
            direction: "right"
        }
    ],
    "sever_setting": [
        {
            elm: document.getElementById("sever_setting_left_buttons"),
            direction: "left"
        }
    ]
};

// plugin load
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

function goMainPage() {
    topicon.style.backgroundImage = "url('./res/img/appicon/icon.png')";
    topicon.onclick = "";
    topname.textContent = `Hello Minecraft Sever Launcher v${AppConfig.appVersion}`;
    goPageWithAnimation({
        hides: PageContainerElements[currentPage],
        hide_container: PageContainers[currentPage],
        shows: PageContainerElements["mainpage"],
        show_container: mainpage
    }, "mainpage");
    currentPage = "mainpage";
}
