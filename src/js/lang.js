/**
 * lang.js
 * (c) 2022 Shuzhou Liu
 * Released under the Apache 2.0 License. Partial rights reserved.
 */

let zh_CN = {
    "all_set": "<b>一切就绪！</b> 您现在可以使用Assistant帮助您背诵了。",
    "go_ahead": "继续",
    "add_piece": "+ 新增背诵",
    "open_piece": "加载历史背诵"
};

let en_US = {
    "all_set": "<b>You're all set! </b> You can now use Assistant to help you with reciting.",
    "go_ahead": "Go ahead",
    "add_piece": "+ Add piece",
    "open_piece": "Load history pieces"
};

/**
 * lang
 * @brief The set of languages. Each object like zh-CN, ru-RU, en-US, etc.
 */
let lang = {"zh-CN": zh_CN, "en-US": en_US};

/**
 * update()
 * @brief Update <lang label="..." /> tags.
 * @param {string} loc 
 */
function update(loc) {
    let sel = document.getElementsByTagName("loc");
    for (var i in sel)
        sel[i].innerHTML = lang[loc][sel[i].innerHTML];
}