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

async function wc(url) {
  const resp = await fetch(url);
  return resp.text();
}

async function theme(firsttime = false) {
  let cfg = JSON.parse(fc(config_path()));
  let themez = cfg.theme;
  let themehex = fc(`theme/${themez}.hex`);
  themehex = hextodec(themehex);
  themehex = dectochar(themehex);
  themehex = JSON.parse(themehex);
  if (firsttime) {
    if (typeof themehex["@include"] !== "undefined") {
      for (let i = 0; i < themehex["@include"].length; i++) {
        css_import(themehex["@include"][i]);
      }
    }
    if (typeof themehex["@script"] !== "undefined") {
      for (let i = 0; i < themehex["@script-url"].length; i++)
        eval(await wc(themehex["@script-url"][i]));
    }
    if (typeof themehex["@script"] !== "undefined") {
      setTimeout(themehex["@additional-script"], 0);
    }
  }
  const cls = document.getElementsByClassName("ast-theme");
  let arr = [];
  for (let i = 0; i < cls.length; i++) arr.push(cls[i]);
  for (let i = 0; i < arr.length; i++)
    arr[i].className = themehex[arr[i].dataset.theme];
}

(async function () {
  await theme(true);
})();
