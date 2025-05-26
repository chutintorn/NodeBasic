// utils/logger.js
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');

// สร้างโฟลเดอร์ logs ถ้ายังไม่มี
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

function writeJsonLog(data, filename) {
  const filePath = path.join(logDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`📝 Log saved: ${filePath}`);
}

module.exports = { writeJsonLog };
