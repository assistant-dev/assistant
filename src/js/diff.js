/**
 * diff.js
 * (c) 2022 Shuzhou Liu
 * Released under the Apache 2.0 License. Partial rights reserved.
 */

var JsDiff = require("diff");

/**
 * diff()
 * @brief Returns a red-green colored diff of two strings.
 * @param {string} oldStr
 * @param {string} newStr
 * @returns {object} An object including two colored strings.
 */
// eslint-disable-next-line
function diff(oldStr, newStr) {
  let diff = JsDiff.diffChars(oldStr, newStr);
  let oldStrDiff = "";
  diff.forEach(function (part) {
    // green for additions, red for deletions
    // grey for common parts
    let color = part.added ? "green" : part.removed ? "red" : "grey";
    // split view
    oldStrDiff += `<span style="color: ${color}">${part.value}</span>`;
  });
  return oldStrDiff;
}
