// index.js
const express = require('express');
const axios   = require('axios');
const cors    = require('cors');
const crypto  = require('crypto');
const { fullLog, saveJson } = require('./viewres');   // ← ใช้ viewres.js

const app = express();
app.use(cors());
app.use(express.json());

// ---------- CONFIG -----------------------------------------------------------------
const NOK_ENDPOINT  = 'https://uat-ota.nokair.com/v1/available-flight-fare';
const CLIENT_ID     = '887eb5c3d01e4cf192404b731ee2eb27';
const CLIENT_SECRET = 'A3B4033E52bE44C5B84c6869b4bd4Bd1';
// -----------------------------------------------------------------------------------

app.post('/flights', async (req, res) => {
  // ถ้ามี X-Correlation-Id ก็ใช้; ถ้าไม่มีก็สร้างใหม่ (ไว้ติดตาม log & ชื่อไฟล์)
  const corrId = req.headers['x-correlation-id'] || crypto.randomUUID();

  try {
    fullLog('Incoming payload', req.body);

    const axiosResp = await axios.post(
      NOK_ENDPOINT,
      req.body,
      {
        headers: {
          'X-Correlation-Id': corrId,
          'client_id':     CLIENT_ID,
          'client_secret': CLIENT_SECRET
        },
        maxBodyLength: Infinity
      }
    );

    fullLog('Nok API response', axiosResp.data);

    // —— บันทึกไฟล์ JSON ——
    const filepath = saveJson(axiosResp.data, corrId);
    console.log(`💾 Saved Nok response at: ${filepath}`);

    // ส่งกลับ data + status เดิม
    res.status(axiosResp.status).json(axiosResp.data);
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(err?.response?.status || 500).json({
      message: 'Failed to retrieve flights',
      details: err?.response?.data || err.message
    });
  }
});

const PORT = process.env.PORT || 3100;
app.listen(PORT, () =>
  console.log(`✈️  Flight proxy listening on http://localhost:${PORT}/flights`)
);
