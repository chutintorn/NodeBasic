// routes/flights.js
const express = require('express');
const axios   = require('axios');
const crypto  = require('crypto');
const { fullLog, saveJson } = require('../viewres');   // ✔️ still use the same helpers

const router = express.Router();

/* ------------------------------------------------------------------
   CONFIG   (ควรย้ายไป .env/Config file ภายหลัง)
------------------------------------------------------------------ */
const NOK_ENDPOINT  = 'https://uat-ota.nokair.com/v1/available-flight-fare';
const CLIENT_ID     = '887eb5c3d01e4cf192404b731ee2eb27';
const CLIENT_SECRET = 'A3B4033E52bE44C5B84c6869b4bd4Bd1';

/* ------------------------------------------------------------------
   POST /flights
------------------------------------------------------------------ */
router.post('/', async (req, res) => {
  // 0️⃣ สร้าง/ดึง Correlation-ID
  const corrId = req.headers['x-correlation-id'] || crypto.randomUUID();

  try {
    /* 1️⃣ LOG: payload ที่มาจาก frontend */
    fullLog('Incoming payload', req.body);

    /* 2️⃣ LOG: จะส่งอะไรออกไปหา Nok OTA */
    fullLog('Outbound to Nok', {
      url: NOK_ENDPOINT,
      headers: {
        'X-Correlation-Id': corrId,
        client_id: CLIENT_ID      // (ไม่ log client_secret เพื่อความปลอดภัย)
      },
      body: req.body
    });

    /* 3️⃣ CALL: ยิงไปยัง Nok OTA API */
    const axiosResp = await axios.post(
      NOK_ENDPOINT,
      req.body,
      {
        headers: {
          'X-Correlation-Id': corrId,
          client_id:     CLIENT_ID,
          client_secret: CLIENT_SECRET
        },
        maxBodyLength: Infinity   // รองรับ request/response ขนาดใหญ่
      }
    );

    /* 4️⃣ LOG: ตอบกลับจาก Nok */
    fullLog('Nok API response', axiosResp.data);

    /* 5️⃣ เซฟ response ลงไฟล์ JSON */
    const filePath = saveJson(axiosResp.data, corrId);
    console.log(`💾 Saved Nok response: ${filePath}`);

    /* 6️⃣ ส่งผลกลับไปหา frontend */
    res.status(axiosResp.status).json(axiosResp.data);

  } catch (err) {
    /* 7️⃣ LOG: Error */
    console.error('❌ Nok API error:', err?.response?.data || err.message);

    res.status(err?.response?.status || 500).json({
      message: 'Failed to retrieve flights',
      details: err?.response?.data || err.message
    });
  }
});

module.exports = router;
