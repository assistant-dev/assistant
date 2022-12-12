/**
 * xfyun.js
 * (c) 2022 Shuzhou Liu
 * Released under the Apache 2.0 License. Partial rights reserved.
 */

function connect() {
    let ctt = JSON.parse(fc(config_folder()+"/.xfyun"));
    let appid = ctt["appid"]
    let apikey = ctt["apikey"];
    // seconds from 1970-01-01 00:00:00
    let ts = Math.round(new Date().getTime() / 1000);
    let signa = buf.toString((CryptoJS.HmacSHA1(md5(appid+ts), apikey)), "base64");
    let lang = "cn";
    var ws = new WebSocket(`wss://rtasr.xfyun.cn/v1/ws?appid=${appid}&ts=${ts}&signa=${signa}&lang=${lang}`);
    ws.onopen = function(evt) {
        
    }
}