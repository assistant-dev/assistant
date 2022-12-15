const CryptoJS = require("crypto-js");
var request = require("request");
var log = require("log4node");
var fs = require("fs");

async function getRsp(file) {
  let json = JSON.parse(fc(config_folder() + "/.xfyun"));

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

// 组装业务参数
function getXParamStr() {
  let xParam = {
    language: "cn|en",
  };
  return CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(JSON.stringify(xParam))
  );
}

// 组装请求头
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

// 组装postBody
function getPostBody(config) {
  let buffer = fs.readFileSync(config.file);
  return {
    image: buffer.toString("base64"),
  };
}
