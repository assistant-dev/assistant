var CryptoJS = require("crypto-js");

class IatRecorder {
  constructor(config) {
    this.config = config;
    this.state = "ing";
    let env = JSON.parse(fc(config_folder() + "/.env"));
    this.appId = env.appid;
    this.apiKey = env.rtasr_apikey;
  }
  start() {
    this.stop();
    if (navigator.getUserMedia && AudioContext) {
      this.state = "ing";
      if (!this.recorder) {
        var context = new AudioContext();
        this.context = context;
        this.recorder = context.createScriptProcessor(0, 1, 1);
        var getMediaSuccess = (stream) => {
          var mediaStream = this.context.createMediaStreamSource(stream);
          this.mediaStream = mediaStream;
          this.recorder.onaudioprocess = (e) => {
            this.sendData(e.inputBuffer.getChannelData(0));
          };
          this.connectWebsocket();
        };
        var getMediaFail = (e) => {
          this.recorder = null;
          this.mediaStream = null;
          this.context = null;
          console.error("Error on requesting microphone. Context: " + e);
        };
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices
            .getUserMedia({
              audio: true,
              video: false,
            })
            .then((stream) => {
              getMediaSuccess(stream);
            })
            .catch((e) => {
              getMediaFail(e);
            });
        } else {
          navigator.getUserMedia(
            {
              audio: true,
              video: false,
            },
            (stream) => {
              getMediaSuccess(stream);
            },
            function (e) {
              getMediaFail(e);
            }
          );
        }
      } else {
        this.connectWebsocket();
      }
    } else {
      var isChrome = navigator.userAgent.toLowerCase().match(/chrome/);
      alert(
        "Your browser does not support the Web Audio API. Please use " +
          (isChrome ? "Chrome" : "Firefox") +
          " instead."
      );
    }
  }

  stop() {
    this.state = "end";
    try {
      this.mediaStream.disconnect(this.recorder);
      this.recorder.disconnect();
    } catch (e) {}
  }

  sendData(buffer) {
    recorderWorker.postMessage({
      command: "transform",
      buffer: buffer,
    });
  }

  sendData(buffer) {
    recorderWorker.postMessage({
      command: "transform",
      buffer: buffer,
    });
  }

  getHandShakeParams() {
    let appId = this.appId;
    let secretKey = this.apiKey;
    let ts = Math.floor(new Date().getTime() / 1000);
    let signa = CryptoJS.MD5(appId + ts).toString();
    signa = CryptoJS.HmacSHA1(signa, secretKey).toString();
    signa = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(signa));
    return (
      "?appid=" + appId + "&ts=" + ts + "&signa=" + encodeURIComponent(signa)
    );
  }

  connectWebsocket() {
    var url = "wss://rtasr.xfyun.cn/v1/ws";
    var urlParam = this.getHandShakeParams();

    url = `${url}${urlParam}`;
    if ("WebSocket" in window) {
      this.ws = new WebSocket(url);
    } else if ("MozWebSocket" in window) {
      this.ws = new MozWebSocket(url);
    } else {
      alert(notSupportTip);
      return null;
    }
    this.ws.onopen = (e) => {
      this.mediaStream.connect(this.recorder);
      this.recorder.connect(this.context.destination);
      setTimeout(() => {
        this.wsOpened(e);
      }, 500);
      this.config.onStart && this.config.onStart(e);
    };
    this.ws.onmessage = (e) => {
      // this.config.onMessage && this.config.onMessage(e)
      this.wsOnMessage(e);
    };
    this.ws.onerror = (e) => {
      this.stop();
      console.error("Close connection on ws.onerror");
      this.config.onError && this.config.onError(e);
    };
    this.ws.onclose = (e) => {
      this.stop();
      console.info("Close connection on ws.onclose");
      $(".start-button").attr("disabled", false);
      this.config.onClose && this.config.onClose(e);
    };
  }

  wsOpened() {
    if (this.ws.readyState !== 1) {
      return;
    }
    var audioData = buffer.splice(0, 1280);
    this.ws.send(new Int8Array(audioData));
    this.handlerInterval = setInterval(() => {
      if (this.ws.readyState !== 1) {
        clearInterval(this.handlerInterval);
        return;
      }
      if (buffer.length === 0) {
        if (this.state === "end") {
          this.ws.send('{"end": true}');
          console.log("Sended end message");
          clearInterval(this.handlerInterval);
        }
        return false;
      }
      var audioData = buffer.splice(0, 1280);
      if (audioData.length > 0) {
        this.ws.send(new Int8Array(audioData));
      }
    }, 40);
  }

  wsOnMessage(e) {
    let jsonData = JSON.parse(e.data);
    if (jsonData.action == "started") {
      console.log("Handshake success");
    } else if (jsonData.action == "result") {
      if (this.config.onMessage && typeof this.config.onMessage == "function") {
        this.config.onMessage(jsonData.data);
      }
    } else if (jsonData.action == "error") {
      console.error("An error occured: ", jsonData);
    }
  }

  ArrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(binary));
  }
}
