/**
 * lang.js
 * (c) 2022 Shuzhou Liu
 * Released under the Apache 2.0 License. Partial rights reserved.
 */

let zh_CN = {
  all_set: "<b>一切就绪！</b> 您现在可以使用Assistant帮助您背诵了。",
  go_ahead: "继续",
  add_piece: "+ 新增背诵",
  open_piece: "加载历史背诵",
  lr_type: "录入方式：",
  please_select: "请选择……",
  text: "文本",
  image: "图片",
  voice: "语音",
  audio: "音频",
  filename: "文件名称：",
  exist_alert: "这个文件已经存在，请您更换一个文件名。",
  name: "名称：",
  enter_prompt: "请输入背诵内容：",
  add: `<i class="bi bi-plus"></i> 新增`,
  save: `<i class="bi bi-save"></i> 保存`,
  "zh-CN": "中文（简体）",
  "en-US": "英语（美国）",
  remaining: "剩余",
  seconds: "秒",
  completed: "完成",
  plz_wait: "请稍候……",
  langsel_prompt: "请您先选择好需要录入的语言。",
  success: "<b>成功！</b> 您的背诵已经成功录入，开始您的背诵吧！",
  bti: "返回首页", // Back to index
};

let zh_HK = {
  all_set: "<b>一切就緒！</b> 您現在可以使用Assistant幫助您背誦了。",
  go_ahead: "繼續",
  add_piece: "+ 新增背誦",
  open_piece: "加載歷史背誦",
  lr_type: "錄入方式：",
  please_select: "請選擇……",
  text: "文本",
  image: "圖片",
  voice: "語音",
  audio: "音頻",
  filename: "文件名稱：",
  exist_alert: "這個文件已經存在，請您更換一個文件名。",
  name: "名稱：",
  enter_prompt: "請輸入背誦內容：",
  add: `<i class="bi bi-plus"></i> 新增`,
  save: `<i class="bi bi-save"></i> 保存`,
  "zh-CN": "中文（簡體）",
  "en-US": "英語（美國）",
  remaining: "剩餘",
  seconds: "秒",
  completed: "完成",
  plz_wait: "請稍候……",
  langsel_prompt: "請您先選擇好需要錄入的語言。",
  success: "<b>成功！</b> 您的背誦已經成功錄入，開始您的背誦吧！",
  bti: "返回首頁", // Back to index
};

let en_US = {
  all_set:
    "<b>You're all set! </b> You can now use Assistant to help you with reciting.",
  go_ahead: "Go ahead",
  add_piece: "+ Add piece",
  open_piece: "Load history pieces",
  lr_type: "Input type:",
  please_select: "Please select...",
  text: "Text",
  image: "Image",
  voice: "Voice",
  audio: "Audio",
  filename: "File name:",
  exist_alert: "This file already exists, please change the file name.",
  name: "Name:",
  enter_prompt: "Please enter the reciting content:",
  add: `<i class="bi bi-plus"></i> Add`,
  save: `<i class="bi bi-save"></i> Save`,
  "zh-CN": "Chinese (Simplified)",
  "en-US": "English (United States)",
  remaining: "Remaining",
  seconds: "seconds",
  completed: "Completed",
  plz_wait: "Please wait...",
  langsel_prompt: "Please select the language you want to input first.",
  success:
    "<b>Success!</b> Your reciting has been successfully input, why not start your reciting now?",
  bti: "Back home", // Back to index
};

/**
 * lang
 * @brief The set of languages. Each object like zh-CN, ru-RU, en-US, etc.
 */
let lang = {
  "zh-CN": zh_CN,
  "zh-HK": zh_HK,
  "en-US": en_US,
};

/**
 * update()
 * @brief Update <lang label="..." /> tags.
 * @param {string} loc
 */
// eslint-disable-next-line no-unused-vars
function update(loc) {
  let sel = document.getElementsByTagName("loc");
  for (var i in sel) sel[i].innerHTML = lang[loc][sel[i].innerHTML];
  let sel2 = document.getElementsByClassName("loc");
  for (i in sel2) sel2[i].innerHTML = lang[loc][sel2[i].innerHTML];
}
