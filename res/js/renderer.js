const {ipcRenderer, shell} = require('electron');

function hideWindow() {
    ipcRenderer.invoke('HideWindow');
}

function closeWindow() {
    ipcRenderer.invoke('CloseWindow');
}

function goToGithub() {
    shell.openExternal('https://github.com/Hxgfk/HMSL');
}

const appVersion = "1.0.0";
const animation_time = "0.2s";
const topicon = document.getElementById("appicon");
const topname = document.getElementById("top_name");
const default_appicon_path = "../img/appicon/icon.png";
const defaultElementDisplayMode = {
    sever_list: "flex",
    mainpage: "block"
}
let nowpage = "mainpage";
const mainpage = document.getElementById('mainpage');
const sever_list = document.getElementById('sever_list');

function transAnimTime(atime_str) {
    if (atime_str.endsWith("s")) {
        return Number(atime_str.replace(/s/g, "")) * 1000;
    } else {
        return Number(atime_str.replace(/ms/g, ""));
    }
}

/**
 * @param {Object} anim_target
 * @param {String} targetType
 * @example
 *     {
 *         hides: [
 *             {
 *                 elm: [targetElement],
 *                 direction: [right/left]
 *             }
 *         ],
 *         hide_container: [hide_container_div],
 *         shows: [
 *             {
 *                 elm: [targetElement],
 *                 direction: [right/left]
 *             }
 *         ],
 *         show_container: [hide_container_div]
 *     }
 */
function goPageWithAnimation(anim_target, targetType) {
    for (const hide_obj of anim_target.hides) {
        switch (hide_obj.direction) {
            case "left":
                hide_obj.elm.style.animation = `left_hide ${animation_time} forwards`;
                break;
            case "right":
                hide_obj.elm.style.animation = `right_hide ${animation_time} forwards`;
        }
    }
    setTimeout(function () {
        anim_target.hide_container.style.display = "none";
        anim_target.show_container.style.display = defaultElementDisplayMode[targetType];
        for (const show_obj of anim_target.shows) {
            switch (show_obj.direction) {
                case "left":
                    show_obj.elm.style.animation = `left_show ${animation_time} forwards`;
                    break;
                case "right":
                    show_obj.elm.style.animation = `right_show ${animation_time} forwards`;
            }
        }
    }, transAnimTime(animation_time));
}

function goMainPage() {
    topicon.style.backgroundImage = "url('./res/img/appicon/icon.png')";
    topicon.onclick = "";
    topname.textContent = `Hello Minecraft Sever Launcher v${appVersion}`;
    goPageWithAnimation({
        hides: [
            {
                elm: document.getElementById("sever_folder_list_leftbar"),
                direction: "left"
            },
            {
                elm: document.getElementById("sever_folder_list_main"),
                direction: "right"
            }
        ],
        hide_container: sever_list,
        shows: [
            {
                elm: document.getElementById("selectlist"),
                direction: "left"
            },
            {
                elm: document.getElementById("runbutton_cont"),
                direction: "right"
            }
        ],
        show_container: mainpage
    }, "mainpage");
    nowpage = "mainpage";
}

function goSeverList() {
    topicon.style.backgroundImage = "url('./res/img/icons/arrow_left.png')";
    topicon.setAttribute("onclick", "goMainPage()");
    topname.textContent = "已安装的服务器";
    goPageWithAnimation({
        hides: [
            {
                elm: document.getElementById("selectlist"),
                direction: "left"
            },
            {
                elm: document.getElementById("runbutton_cont"),
                direction: "right"
            }
        ],
        hide_container: mainpage,
        shows: [
            {
                elm: document.getElementById("sever_folder_list_leftbar"),
                direction: "left"
            },
            {
                elm: document.getElementById("sever_folder_list_main"),
                direction: "right"
            }
        ],
        show_container: sever_list
    }, "sever_list");
    nowpage = "sever_list";
}