function transAnimTime(atime_str) {
    if (atime_str.endsWith("s")) {
        return Number(atime_str.replace(/s/g, "")) * 1000;
    } else {
        return Number(atime_str.replace(/ms/g, ""));
    }
}

function registryPage(id, elementtext, maincontainer_display_mode="block", contentcontainer_animation=null) {
    unregistered_page.push({
        id: id,
        elementtext: elementtext,
        maincontainer_display_mode: maincontainer_display_mode,
        contentcontainer_animation: contentcontainer_animation
    });
}

function goPageWithAnimation(anim_target, targetId, callback=function (){}) {
    if (AppConfig.general.animation) {
        for (const hide_obj of anim_target.hides) {
            if (hide_obj.elm === "emeta") {
                const list = Array.from(document.querySelectorAll("[emeta]"))
                    .filter(
                        element => {
                            const m = eval(`(${element.getAttribute("emeta")})`);
                            return m["pgfrom"] === targetId && m["anim"] === true;
                        }
                    );
                for (const e of list) {
                    const elm_emeta = eval(`(${e.getAttribute("emeta")})`);
                    e.style.animation = `${elm_emeta.dire}_hide ${AppConfig.general.animation_time} forwards`;
                }
                continue;
            }
            hide_obj.elm.style.animation = `${hide_obj.direction}_hide ${AppConfig.general.animation_time} forwards`;
        }
        setTimeout(function () {
            anim_target.hide_container.style.display = "none";
            anim_target.show_container.style.display = defaultElementDisplayMode[targetId];
            for (const show_obj of anim_target.shows) {
                if (show_obj.elm === "emeta") {
                    const list = Array.from(document.querySelectorAll("[emeta]"))
                        .filter(
                            element => {
                                const m = eval(`(${element.getAttribute("emeta")})`);
                                return m["pgfrom"] === targetId && m["anim"] === true;
                            }
                        );
                    let animTime = 30;
                    for (const e of list) {
                        setTimeout(function () {
                            const elm_emeta = eval(`(${e.getAttribute("emeta")})`);
                            e.style.animation = `${elm_emeta.dire}_show ${AppConfig.general.animation_time} forwards`;
                        }, transAnimTime(AppConfig.general.animation_time) + animTime);
                        animTime += 30;
                    }
                    continue;
                }
                show_obj.elm.style.animation = `${show_obj.direction}_show ${AppConfig.general.animation_time} forwards`;
            }
            callback();
        }, transAnimTime(AppConfig.general.animation_time));
    }else {
        for (const hide_obj of anim_target.hides) {
            if (hide_obj.elm === "emeta") {
                const list = Array.from(document.querySelectorAll("[emeta]"))
                    .filter(
                        element => {
                            return eval(`(${element.getAttribute("emeta")})`)["pgfrom"] === targetId;
                        }
                    );
                for (const e of list) {
                    e.style.style.display = "none";
                }
                continue;
            }
            hide_obj.elm.style.display = "none";
        }
        anim_target.hide_container.style.display = "none";
        anim_target.show_container.style.display = defaultElementDisplayMode[targetId];
        for (const show_obj of anim_target.shows) {
            if (show_obj.elm === "emeta") {
                const list = Array.from(document.querySelectorAll("[emeta]"))
                    .filter(
                        element => {
                            return eval(`(${element.getAttribute("emeta")})`)["pgfrom"] === targetId;
                        }
                    );
                for (const e of list) {
                    e.style.style.display = "block";
                }
                continue;
            }
            show_obj.elm.style.display = "block";
        }
    }
}

function goPage(id, topbar={
    iconPath: "url('./res/img/appicon/icon.png')",
    iconClickEvent: "",
    title: `Hello Minecraft Sever Launcher v${AppConfig.appVersion}`
}, callback=function () {}) {
    if (!PageContainerElements.hasOwnProperty(id) && !PageContainers.hasOwnProperty(id)) {
        console.error(`Page isn't registered. (ID: ${id})`);
        return;
    }
    topicon.style.backgroundImage = topbar.iconPath;
    topicon.setAttribute("onclick", topbar.iconClickEvent);
    topname.textContent = topbar.title;
    goPageWithAnimation({
        hides: PageContainerElements[currentPage],
        hide_container: PageContainers[currentPage],
        shows: PageContainerElements[id],
        show_container: PageContainers[id]
    }, id, callback);
    currentPage = id;
}
