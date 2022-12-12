const CryptoJS = require('crypto-js')
var request = require('request')
var log = require('log4node')
var fs = require('fs')

function ocr(file) {

    let json = JSON.parse(fc(config_folder() + "/.xfyun"));

    const config = {
        hostUrl: "https://webapi.xfyun.cn/v1/service/v1/ocr/general",
        host: "webapi.xfyun.cn",
        appid: json.appid,
        apiKey: json.ise_apikey,
        uri: "/v1/ise",
        file: file
    }

    // 获取当前时间戳
    let ts = parseInt(new Date().getTime() / 1000)

    let options = {
        url: config.hostUrl,
        headers: getReqHeader(),
        form: getPostBody()
    }
    // 返回结果json串
    request.post(options, (err, resp, body) => {
        if (err) {
            log.error(err)
        }
        let res = JSON.parse(body)
        if (res.code != 0) {
            log.error(`发生错误，错误码：${res.code} 错误原因：${res.desc} sid：${res.sid}`)
            log.error(`请前往https://www.xfyun.cn/document/error-code?code=${res.code}查询解决办法`)
            return false
        }
        // get pure text and return
        let text = ""
        for (let i = 0; i < res.data.block.length; i++) {
            for (let j = 0; j < res.data.block[i].line.length; j++) {
                for (let k = 0; k < res.data.block[i].line[j].word.length; k++) {
                    text += res.data.block[i].line[j].word[k].content
                }
            }
        }
        return text;
    })

}

// 组装业务参数
function getXParamStr() {
    let xParam = {
        language: 'cn|en'
    }
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(xParam)))
}

// 组装请求头
function getReqHeader() {
    let xParamStr = getXParamStr()
    let xCheckSum = CryptoJS.MD5(config.apiKey + ts + xParamStr).toString()
    return {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'X-Appid': config.appid,
        'X-CurTime': ts + "",
        'X-Param': xParamStr,
        'X-CheckSum': xCheckSum
    }
}

// 组装postBody
function getPostBody() {
    let buffer = fs.readFileSync(config.file)
    return {
        image: buffer.toString('base64'),
    }
}