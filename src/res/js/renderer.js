function hideWindow() {
    window.dep.ipcRenderer.invoke('HideWindow');
}

function closeWindow() {
    window.dep.ipcRenderer.invoke('CloseApp');
}

function goToGithub() {
    window.dep.ipcRenderer.send("OpenURLByDefaultBrowser", ['https://github.com/Hxgfk/HMSL',])
}

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
            elm: "emeta"
        },
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
            elm: "emeta",
        },
        {
            elm: document.getElementById("sever_folder_list_main"),
            direction: "right"
        }
    ],
    "sever_setting": [
        {
            elm: "emeta"
        },
        {
            elm: document.getElementById("sever_setting_left_buttons"),
            direction: "left"
        }
    ]
};

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

window.dep.ipcRenderer.send("GetAfterLoadScript");
window.dep.ipcRenderer.on('GetAfterLoadScriptBack', async (event, data) => {
    for (const c of data.c) {
        let e = document.createElement("script");
        e.innerHTML = c;
        document.body.appendChild(e);
    }
    console.log("After Script Load Success");
});