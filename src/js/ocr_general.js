/* global fc */
/* global config_folder */
const CryptoJS = require("crypto-js");
var fs = require("fs");

/**
 * async getRsp()
 * @brief Get response from the xfyun api.
 * @param {string} file The path of the file to be recognized.
 * @requires CryptoJS
 * @requires fs
 * @returns {string} The text of the xfyun response, with the confidence etc. unusable data.
 */
async function getRsp(file) {
  let json = JSON.parse(fc(config_folder() + "/.env"));

  const config = {
    hostUrl: "https://webapi.xfyun.cn/v1/service/v1/ocr/general",
    host: "webapi.xfyun.cn",
    appid: json.appid,
    apiKey: json.ise_apikey,
    uri: "/v1/ise",
    file: file,
  };

  // 获取当前时间戳
  let ts = parseInt(new Date().getTime() / 1000);

  const response = await fetch(
    "https://webapi.xfyun.cn/v1/service/v1/ocr/general",
    {
      method: "POST",
      headers: getReqHeader(config, ts),
      body: encodeURI("image=" + getPostBody(config).image),
    }
  );
  return response.text();
}

/**
 * async ocr()
 * @param {string} file The path of the file to be recognized.
 * @returns {string} The text of the xfyun response, with the plain text. Useful.
 */
// eslint-disable-next-line
async function ocr(file) {
  let text = await getRsp(file);
  let json = JSON.parse(text);
  let result = "";
  for (let i = 0; i < json.data.block.length; i++) {
    let line = json.data.block[i].line;
    for (let j = 0; j < line.length; j++) {
      let word = line[j].word;
      for (let k = 0; k < word.length; k++) {
        result += word[k].content;
      }
    }
  }
  return result;
}

/**
 * getXParamStr()
 * @brief Get the xParamStr.
 * @requires CryptoJS
 * @returns {string} The xParamStr.
 */
function getXParamStr() {
  let xParam = {
    language: "cn|en",
  };
  return CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(JSON.stringify(xParam))
  );
}

/**
 * getReqHeader()
 * @brief Get the request header.
 * @param {object} config The config object.
 * @param {number} ts The timestamp now.
 * @requires CryptoJS
 * @returns {object} The request header.
 */
function getReqHeader(config, ts) {
  let xParamStr = getXParamStr();
  let xCheckSum = CryptoJS.MD5(config.apiKey + ts + xParamStr).toString();
  return {
    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    "X-Appid": config.appid,
    "X-CurTime": ts + "",
    "X-Param": xParamStr,
    "X-CheckSum": xCheckSum,
  };
}

/**
 * getPostBody()
 * @brief Get the post body.
 * @param {object} config The config object.
 * @requires fs
 * @returns {object} The post body.
 */
function getPostBody(config) {
  let buffer = fs.readFileSync(config.file);
  return {
    image: buffer.toString("base64"),
  };
}
