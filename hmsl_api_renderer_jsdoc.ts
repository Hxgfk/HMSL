/**
 * @description 把字符串的时间（格式：s或者ms）转换为数字
 * @param {String} atime_str
 * @example
 * transAnimTime("0.5s");
 *
 * // Result: 500
 */
function transAnimTime(atime_str): Number {return null}

/**
 * @description 以动画形式显示页面内容
 * @param {Object} anim_target
 * @param {String} targetType
 * @param {Function} callback
 * @example
 * anim_target 参数格式:
 *     {
 *         hides: [
 *             {
 *                 elm: [targetElement],
 *                 direction: [right/left/top/bottom]
 *             }
 *         ],
 *         hide_container: [hide_container_div],
 *         shows: [
 *             {
 *                 elm: [targetElement],
 *                 direction: [right/left/top/bottom]
 *             }
 *         ],
 *         show_container: [hide_container_div]
 *     }
 */
function goPageWithAnimation(anim_target: Object, targetType: String, callback: Function=function(){}): void {}


/**
 * @description 跳转页面
 * @param {String} id
 * @param {Object} topbar
 * @example
 * topbar 参数格式:
 *     {
 *         iconPath: "url('./res/img/appicon/icon.png')",
 *         iconClickEvent: "",
 *         title: `Hello Minecraft Sever Launcher v${appVersion}`
 *     }
 */
function goPage(id: String, topbar: Object): void {}

/**
 * @description 注册页面。<br>此方法请在HTMLPreInit的时候注册否则无效
 * @param {String} id
 * @param {String} elementtext
 * @param {String} maincontainer_display_mode
 * @param {Object} contentcontainer_animation
 * @example
 * contentcontainer_animation 参数格式:
 *     [
 *         {
 *             elm: Element,
 *             direction: [right/left/top/bottom]
 *         }
 *     ]
 */
function registryPage(id, elementtext, maincontainer_display_mode: String="block", contentcontainer_animation: Object=null): void {}