/**
 * lang.js
 * (c) 2022 Shuzhou Liu
 * Released under the Apache 2.0 License. Partial rights reserved.
 */

let zh_CN = {
    "all_set": "<b>一切就绪！</b> 您现在可以使用Assistant帮助您背诵了。",
    "go_ahead": "继续",
    "add_piece": "+ 新增背诵",
    "open_piece": "加载历史背诵",
    "lr_type": "录入方式：",
    "please_select": "请选择……",
    "text": "文本",
    "image": "图片",
    "voice": "语音",
    "audio": "音频",
    "filename": "文件名称：",
    "exist_alert": "这个文件已经存在，请您更换一个文件名。",
    "name": "名称：",
    "enter_prompt": "请输入背诵内容：",
    "ocr_prompt": "请在<b>Assistant所在磁盘</b>中用一个文件夹单独放置您的图片，然后在下面输入文件夹路径，<b>不要输入盘符</b>。",
    "image_prompt": "请您输入您的图片文件夹，<b>不要输入盘符</b>：",
};

let en_US = {
    "all_set": "<b>You're all set! </b> You can now use Assistant to help you with reciting.",
    "go_ahead": "Go ahead",
    "add_piece": "+ Add piece",
    "open_piece": "Load history pieces",
    "lr_type": "Input type:",
    "please_select": "Please select...",
    "text": "Text",
    "image": "Image",
    "voice": "Voice",
    "audio": "Audio",
    "filename": "File name:",
    "exist_alert": "This file already exists, please change the file name.",
    "name": "Name:",
    "enter_prompt": "Please enter the reciting content:",
    "ocr_prompt": "Please put your images in a folder on <b>the disk where Assistant is located</b>, then enter the folder path below, <b>without the disk letter</b>.",
    "image_prompt": "Please enter your image folder, <b>without the disk letter</b>:",
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
    let sel2 = document.getElementsByClassName("loc");
    for (var i in sel2)
        sel2[i].innerHTML = lang[loc][sel2[i].innerHTML];
}