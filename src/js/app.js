var os = require("os");
var fs = require("fs");
var pathr = require("path");

/**
 * config_path()
 * @brief Get the path of the configuration file
 * @requires os
 * @returns {string} Path of the config file for assistant
 */
function config_path() {
  return os.platform() == "win32"
    ? "/assistant_conf/config.json"
    : "/etc/assistant/config.json";
}

/**
 * config_folder()
 * @brief Get the path of the configuration folder
 * @requires os
 * @returns {string} Path of the config folder for assistant
 */
function config_folder() {
  return os.platform() == "win32" ? "/assistant_conf" : "/etc/assistant";
}

/**
 * detect_first_run()
 * @brief Detect if the assistant is running for the first time
 * @uses config_path()
 * @requires fs
 * @returns {boolean} If the assistant is the first time to run
 */
// eslint-disable-next-line no-unused-vars
function detect_first_run() {
  return !fs.existsSync(config_path());
}

/**
 * $i()
 * @brief Get the element by id
 * @param {string} id The id of the element
 * @returns {HTMLElement} The HTML element with the id.
 */
// eslint-disable-next-line no-unused-vars
function $i(id) {
  return document.getElementById(id);
}

/**
 * $c()
 * @brief Create an element with $tag and the options.
 * @param {string} tag The tag name of the element
 * @param {object} options The options of the element, like id, className, style, etc.
 * @returns {HTMLElement} The created element with <$tag> tag
 */
// eslint-disable-next-line no-unused-vars
function $c(tag, options = {}) {
  let cr = document.createElement(tag);
  if (options) {
    for (let key in options) {
      cr[key] = options[key];
    }
  }
  return cr;
}

/**
 * save_preferences()
 * @brief Save the preferences to the config file
 * @uses config_path()
 * @uses $i('theme')
 * @uses $i('language')
 * @requires fs
 */
// eslint-disable-next-line no-unused-vars
function save_preferences() {
  let folder = config_folder();
  if (!fs.existsSync(folder)) fs.mkdirSync(folder);
  let path = config_path();
  if (!fs.existsSync(folder + "/dl")) fs.mkdirSync(folder + "/dl");
  let data = {
    language: document.getElementById("language").value,
    theme: document.getElementById("theme").value,
  };
  let json = JSON.stringify(data);
  fs.writeFileSync(path, json);
  window.location.href = "all_set.html";
}

/**
 * fc()
 * @brief Read the content of a file
 * @param {string} file  The path of the file
 * @requires fs
 * @returns {string} The content of the file
 */
// eslint-disable-next-line no-unused-vars
function fc(file) {
  let rd = fs.readFileSync(file);
  return rd.toString();
}

/**
 * newline()
 * @brief Get the newline character of the current platform
 * @requires os
 * @returns {string} The new line string (char) of the current platform
 */
// eslint-disable-next-line no-unused-vars
function newline() {
  return os.platform() == "win32" ? "\r\n" : "\n";
}

/**
 * suffix()
 * @brief Get the suffix of a file
 * @param {string} imgtype A MIME type
 * @returns {string} The extension of the file type
 */
// eslint-disable-next-line no-unused-vars
function suffix(imgtype) {
  if (imgtype == "image/png") return ".png";
  else if (imgtype == "image/jpeg") return ".jpeg";
  else return "";
}

/**
 * fileNameByPath()
 * @brief Get the file name from a path
 * @param {string} _path The path of the file
 * @requires path
 * @returns {string} The name of the file
 */
// eslint-disable-next-line no-unused-vars
function fileNameByPath(_path) {
  return pathr.basename(_path);
}

/**
 * fileSize()
 * @brief Get the size of a file
 * @param {string} path The path of the file
 * @requires fs
 * @returns {number} The size of the file in bytes
 */
// eslint-disable-next-line no-unused-vars
function fileSize(path) {
  try {
    const stats = fs.statSync(path);
    return stats.size;
  } catch (err) {
    return -1;
  }
}

/**
 * mts()
 * @brief Convert miliseconds to seconds
 * @param {number} milisec The miliseconds to convert
 * @returns {num} The seconds.
 */
// eslint-disable-next-line no-unused-vars
function mts(milisec) {
  return milisec / 1000;
}

/**
 * ttext()
 * @brief Convert seconds to human-readable text, e.g. 1 minutes 30 seconds, 1分钟30秒
 * @param {number} sec The seconds to convert to
 * @param {string} lang The language option. Defaults to "en-US", options see js/lang.js
 * @returns {string} The human-readable text
 */
// eslint-disable-next-line no-unused-vars
function ttext(sec, lang = "en-US") {
  let min = Math.floor(sec / 60);
  let sec2 = Math.floor(sec % 60);
  if (lang == "zh-CN") {
    return min + "分钟" + sec2 + "秒";
  } else {
    return min + " minutes " + sec2 + " seconds";
  }
}
