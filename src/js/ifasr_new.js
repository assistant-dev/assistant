var CryptoJS = require("crypto-js");
var fs = require("fs");
var querystring = require("querystring");
var buffer = require("buffer");

async function getRsp(file, lang) {
  let json = JSON.parse(fc(config_folder() + "/.xfyun"));

  const config = {
    url: "https://raasr.xfyun.cn/v2/api/upload",
    appid: json.appid,
    secretKey: json.ifasr_new_apikey,
    file: file,
  };

  const body = {
    appId: config.appid,
    fileName: fileNameByPath(file),
    fileSize: fileSize(file),
    duration: await duration(file),
    language: lang,
  };

  let baseString = config.appid + ts;

  baseString = CryptoJS.MD5(baseString);

  baseString = CryptoJS.HmacSHA1(baseString, config.secretKey);

  baseString = buffer.Buffer.from(baseString).toString("base64");

  body.signa = baseString;

  body.ts = parseInt(new Date().getTime() / 1000);

  const response = await fetch(config.url, {
    method: "POST",
    body: querystring.stringify(body),
  });

  return response.text();
}

async function ifasr(file, lang) {
  let text = await getRsp(file, lang);

  let json = JSON.parse(text);

  if (json.code == "000000") {
    return json.content;
  } else {
    console.error(`Error code ${json.code}: ${json.descInfo}`);
    return -1;
  }
}
