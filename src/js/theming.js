/**
 * theming.js
 * (c) 2022 Shuzhou Liu
 * Released under the Apache-2.0 License. Partial rights reserved.
 */

function hextodec(hex) {
  // split hex into 2-digit chunks
  let hexarr = hex.match(/.{1,2}/g);
  let decarr = [];
  for (let i = 0; i < hexarr.length; i++) {
    decarr.push(parseInt(hexarr[i], 16));
  }
  return decarr;
}

function dectochar(dec) {
  // ascii codes
  for (let i = 0; i < dec.length; i++) {
    dec[i] = String.fromCharCode(dec[i]);
  }
  return dec.join("");
}

function css_import(css) {
  let css_import = document.createElement("link");
  css_import.setAttribute("rel", "stylesheet");
  css_import.setAttribute("href", css);
  document.head.appendChild(css_import);
}

function theme() {
  let cfg = JSON.parse(fc(config_path()));
  let theme = cfg.theme;
  let themehex = fc(`theme/${theme}.hex`);
  themehex = hextodec(themehex);
  themehex = dectochar(themehex);
  themehex = JSON.parse(themehex);
  for (let i = 0; i < themehex["@include"].length; i++) {
    css_import(themehex["@include"][i]);
  }
  for (let i = 0; i < themehex["@script-url"].length; i++) {
    let script = document.createElement("script");
    script.setAttribute("src", themehex["@script-url"][i]);
    document.body.appendChild(script);
  }
  setTimeout(themehex["@additional-script"], 0);
  let cls = document.getElementsByClassName("ast-theme");
  for (let i = 0; i < cls.length; i++) {
    let t = cls[i].dataset.theme;
    cls.className = themehex[t];
  }
}

(function () {
  theme();
})();
