class IatTaste {
  constructor() {
    var iatRecorder = new IatRecorder({
      onClose: () => {
        this.stop();
        this.reset();
      },
      onError: (data) => {
        this.stop();
        this.reset();
        console.error("Websocket connection failed. Data: " + data);
      },
      onMessage: (message) => {
        this.setResult(JSON.parse(message));
      },
      onStart: () => {
        $("hr").addClass("hr");
        var dialect = $(".dialect-select").find("option:selected").text();
        $(".taste-content").css("display", "none");
        $(".start-taste").addClass("flex-display-1");
        $(".dialect-select").css("display", "none");
        $(".start-button").text("结束转写");
        $(".time-box").addClass("flex-display-1");
        $(".dialect").text(dialect).css("display", "inline-block");
        this.counterDown($(".used-time"));
      },
    });
    this.iatRecorder = iatRecorder;
    this.counterDownDOM = $(".used-time");
    this.counterDownTime = 0;

    this.text = {
      start: "开始转写",
      stop: "结束转写",
    };
    this.resultText = "";
  }

  start() {
    this.iatRecorder.start();
  }

  stop() {
    this.iatRecorder.stop();
  }

  reset() {
    buffer = [];
  }
  
  setResult(data) {
    let rtasrResult = [];
    rtasrResult[data.seg_id] = data;
    rtasrResult.forEach((i) => {
      let str = "";
      if (i.cn.st.type == 0) {
        i.cn.st.rt.forEach((j) => {
          j.ws.forEach((k) => {
            k.cw.forEach((l) => {
              str += l.w;
            });
          });
        });
      }
    });
  }
}
