// viewres.js
// -------------------------------------------------
// Helper 2 อย่าง:
//   (1) fullLog()  : pretty-print object ทุกชั้นลงคอนโซล
//   (2) saveJson() : เซฟออบเจ็กต์เป็นไฟล์ .json ในโฟลเดอร์ apiResponses
// -------------------------------------------------
const util = require('util');
const fs   = require('fs');
const path = require('path');

// ── ถ้าโฟลเดอร์ apiResponses ยังไม่มี ให้สร้าง ──
const OUTPUT_DIR = path.join(__dirname, 'apiResponses');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

// (1) pretty-print
function fullLog(label, obj) {
  console.log(
    `\n===== ${label} =====`,
    util.inspect(obj, {
      depth:           null,   // โชว์ทุกชั้น
      colors:          true,   // มีสีถ้าเทอร์มินัลรองรับ
      maxArrayLength:  null    // โชว์อาร์เรย์ครบ
    })
  );
}

// (2) saveJson
function saveJson(obj, basename = 'response') {
  const ts   = new Date().toISOString().replace(/[:.]/g, '-'); // 2025-05-17T11-24-30-123Z
  const file = path.join(OUTPUT_DIR, `${ts}_${basename}.json`);
  fs.writeFileSync(file, JSON.stringify(obj, null, 2));
  return file; // ส่งกลับ path เผื่ออยาก log ต่อ
}

module.exports = { fullLog, saveJson };
