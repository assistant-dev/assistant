var fs = require("fs");

fs.rmdirSync("/assistant_conf/dl", { recursive: true });
fs.rmSync("/assistant_conf/config.json", { force: true });
