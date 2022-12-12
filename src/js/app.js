var os = require("os");
var fs = require("fs");

function config_path() { return os.platform() == "win32" ? "/assistant_conf/config.json" : "/etc/assistant/config.json"; }

function config_folder() { return os.platform() == "win32" ? "/assistant_conf" : "/etc/assistant"; }

function detect_first_run() { return !fs.existsSync(config_path()); }

function save_preferences() {
    let folder = config_folder();
    if (!fs.existsSync(folder)) fs.mkdirSync(folder);
    let path = config_path();
    let data = {
        "language": document.getElementById("language").value,
        "theme": document.getElementById("theme").value,
    };
    let json = JSON.stringify(data);
    fs.writeFileSync(path, json);
    window.location.href = "all_set.html";
}

function fc(file) {
    let rd = fs.readFileSync(file);   
    return rd.toString();
}

function $i(id) { return document.getElementById(id); }