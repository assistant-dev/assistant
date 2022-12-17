const CryptoJS = require("crypto-js");
const WebSocket = require("ws");
var fs = require("fs");
var log = require("log4node");

function getReq() {
  let env = JSON.parse(fc(config_path() + "/.env"));
  const config = {
    hostUrl: "wss://rtasr.xfyun.cn/v1/ws",
    appid: env.appid,
    apiKey: env.rta_apikey,
    file: "./test.pcm",
    highWaterMark: 1280,
  };
  let ts = parseInt(new Date().getTime() / 1000);
  let wssUrl =
    config.hostUrl +
    "?appid=" +
    config.appid +
    "&ts=" +
    ts +
    "&signa=" +
    getSigna(ts);
  let ws = new WebSocket(wssUrl);
  ws.on("open", (event) => {
    log.info("websocket connect!");
  });
  let rtasrResult = [];
  ws.on("message", (data, err) => {
    if (err) {
      log.info(`err:${err}`);
      return;
    }
    let res = JSON.parse(data);
    switch (res.action) {
      case "error":
        log.info(`error code:${res.code} desc:${res.desc}`);
        break;
      case "started":
        log.info("started!");
        log.info("sid is:" + res.sid);
        var readerStream = fs.createReadStream(config.file, {
          highWaterMark: config.highWaterMark,
        });
        readerStream.on("data", function (chunk) {
          ws.send(chunk);
        });
        readerStream.on("end", function () {
          ws.send('{"end": true}');
        });
        break;
      case "result":
        let data = JSON.parse(res.data);
        rtasrResult[data.seg_id] = data;
        if (data.cn.st.type == 0) {
          rtasrResult.forEach((i) => {
            let str = "实时转写";
            str +=
              i.cn.st.type == 0 ? "【最终】识别结果：" : "【中间】识别结果：";
            i.cn.st.rt.forEach((j) => {
              j.ws.forEach((k) => {
                k.cw.forEach((l) => {
                  str += l.w;
                });
              });
            });
            log.info(str);
          });
        }
        break;
    }
  });
  ws.on("close", () => {
    log.info("connect close!");
  });
  ws.on("error", (err) => {
    log.error("websocket connect err: " + err);
  });
}
function getSigna(ts) {
  let md5 = CryptoJS.MD5(config.appid + ts).toString();
  let sha1 = CryptoJS.HmacSHA1(md5, config.apiKey);
  let base64 = CryptoJS.enc.Base64.stringify(sha1);
  return encodeURIComponent(base64);
}
