// viewres.js
const util = require('util');
const fs   = require('fs');
const path = require('path');

const BASE_DIR     = path.join(__dirname, 'apiLogs');
const CONSOLE_DIR  = path.join(BASE_DIR, 'console');
const FORWARD_DIR  = path.join(BASE_DIR, 'forward');
const RESPONSE_DIR = path.join(BASE_DIR, 'responses');
const INOUTRES_DIR = path.join(BASE_DIR, 'inoutres');

[CONSOLE_DIR, FORWARD_DIR, RESPONSE_DIR, INOUTRES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function fullLog(label, obj) {
  const ts = new Date().toISOString();
  const pretty = util.inspect(obj, { depth: null, colors: true, maxArrayLength: null });
  const block = `\n🟦 [${ts}] ===== ${label.toUpperCase()} =====\n${pretty}\n`;
  console.log(block);
  appendToFile(path.join(CONSOLE_DIR, 'debug.log'), block);
}

function saveJson(obj, basename = 'response') {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const file = path.join(RESPONSE_DIR, `${ts}_${basename}.json`);
  fs.writeFileSync(file, JSON.stringify(obj, null, 2));
  return file;
}

function saveForwardJson(obj, basename = 'forward') {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const file = path.join(FORWARD_DIR, `${ts}_${basename}.json`);
  fs.writeFileSync(file, JSON.stringify(obj, null, 2));
  return file;
}

function saveInOutRes({ corrId, incoming, outbound, response }) {
  const ts = new Date().toISOString();
  const content = [
    `##########────────────────────────────────────────────────────────`,
    `🟢 [${ts}] ===== INCOMING PAYLOAD =====`,
    JSON.stringify(incoming, null, 2),
    `\n🔵 [${ts}] ===== OUTBOUND TO NOK =====`,
    JSON.stringify(outbound, null, 2),
    `\n🟣 [${ts}] ===== NOK API RESPONSE =====`,
    JSON.stringify(response, null, 2),
    `**********────────────────────────────────────────────────────────`
  ].join('\n');

  const file = path.join(INOUTRES_DIR, `inoutres_${corrId}.log`);
  fs.writeFileSync(file, content);
  return file;
}

function appendToFile(filePath, text) {
  fs.appendFileSync(filePath, text + '\n');
}

module.exports = {
  fullLog,
  saveJson,
  saveForwardJson,
  saveInOutRes
};
