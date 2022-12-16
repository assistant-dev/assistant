/* global fc */
/* global config_folder */
/* global fileNameByPath */
/* global fileSize */
/* global duration */
var CryptoJS = require("crypto-js");
var querystring = require("querystring");
var buffer = require("buffer");

function duration(audioFile) {
  let audio = new Audio(audioFile);
  return audio.duration;
}

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
    duration: duration(file),
    language: lang,
  };

  body.ts = parseInt(new Date().getTime() / 1000);

  let baseString = config.appid + body.ts;
  // use utf-8
  baseString = CryptoJS.MD5(baseString, { encoding: CryptoJS.enc.Utf8 }).toString();
  baseString = CryptoJS.HmacSHA1(baseString, config.secretKey, { encoding: CryptoJS.enc.Utf8 }).toString();
  baseString = window.btoa(baseString);

  console.log(baseString);

  body.signa = baseString;

  const response = await fetch(config.url+"?" + querystring.stringify(body), {
    method: "POST",
    body: fc(config.file),
    headers: {
      "Content-Type": "application/octet-stream",
    }
  });

  return response.text();
}

// eslint-disable-next-line no-unused-vars
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

async function getRsp2(orderId) {
  let json = JSON.parse(fc(config_folder() + "/.xfyun"));

  const config = {
    url: "https://raasr.xfyun.cn/v2/api/getResult",
    appid: json.appid,
    secretKey: json.ifasr_new_apikey,
  };

  const body = {
    appId: config.appid,
    orderId: orderId,
  };

  body.ts = parseInt(new Date().getTime() / 1000);

  let baseString = config.appid + body.ts;

  baseString = CryptoJS.MD5(baseString);

  baseString = CryptoJS.HmacSHA1(baseString, config.secretKey);

  baseString = window.btoa(baseString);

  body.signa = baseString;

  const response = await fetch(config.url, {
    method: "POST",
    body: querystring.stringify(body),
  });

  return response.text();
}

// eslint-disable-next-line no-unused-vars
async function ifasrq(orderId) {
  let text = await getRsp2(orderId);

  let json = JSON.parse(text);

  if (json.code == "000000") {
    let res = json.content.orderResult;
    res = JSON.parse(res);
    res = res.lattice;
    let text = "";
    for (let i = 0; i < res.length; i++) {
      let g = res[i].json_1best;
      g = JSON.parse(g);
      g = g.st.rt;
      for (let j = 0; j < g.length; j++) {
        let h = g[j].ws;
        for (let k = 0; k < h.length; k++) {
          let hy = h[k].cw;
          for (let l = 0; l < hy.length; l++) {
            text += hy[l].w;
          }
        }
      }
    }
    return text;
  } else {
    console.error(`Error code ${json.code}: ${json.descInfo}`);
    return -1;
  }
}
