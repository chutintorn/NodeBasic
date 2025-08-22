// routes/pricedetails.js
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const {
  fullLog,
  saveJson,
  saveInOutRes
} = require('../viewres');

const router = express.Router();

//const NOK_PRICE_DETAIL_ENDPOINT = 'https://uat-ota.nokair.com/v1/fare-price-detailddddd';
const NOK_PRICE_DETAIL_ENDPOINT = 'https://uat-ota.nokair.com/v1/pricing-details';
const CLIENT_ID = '887eb5c3d01e4cf192404b731ee2eb27';
const CLIENT_SECRET = 'A3B4033E52bE44C5B84c6869b4bd4Bd1';

const HOP_HEADERS = new Set([
  'connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization',
  'te', 'trailer', 'transfer-encoding', 'upgrade', 'host', 'content-length',
   // ❌ remove both if present
]);

router.post('/', async (req, res) => {
  const corrId = req.headers['x-correlation-id'] || crypto.randomUUID();
  const incoming = req.body;

  try {
    // ✅ Extract security-token from headers
    const securityToken = req.headers['security-token'] || req.headers['securitytoken'] || '';

    // ✅ Log incoming request
    fullLog('Incoming price detail request', {
      headers: req.headers,
      body: incoming
    });

    // ✅ Construct outbound headers, filter out hop-by-hop and old tokens
    const outboundHeaders = {
      ...Object.fromEntries(
        Object.entries(req.headers)
          .filter(([key]) => !HOP_HEADERS.has(key.toLowerCase()))
      ),
      'X-Correlation-Id': corrId,
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET,
      'security-token': securityToken // ✅ Use only new token
    };

    const outbound = {
      agencyCode: "",
      flightFareKey: [...incoming],
      includeExtraServices: true
    };

    fullLog('Outbound to Nok Fare Price Detail', {
      url: NOK_PRICE_DETAIL_ENDPOINT,
      headers: outboundHeaders,
      body: outbound
    });

    const axiosResp = await axios.post(NOK_PRICE_DETAIL_ENDPOINT, outbound, {
      headers: outboundHeaders,
      maxBodyLength: Infinity
    });

    fullLog('Nok Price Detail response headers', axiosResp.headers);
    fullLog('Nok Price Detail response body', axiosResp.data);

    saveInOutRes({
      corrId,
      incoming,
      outbound,
      response: axiosResp.data
    });

    const filePath = saveJson(axiosResp.data, `priceDetail_${corrId}`);
    console.log(`💾 Saved Price Detail response: ${filePath}`);

    Object.entries(axiosResp.headers).forEach(([key, value]) => {
      if (!HOP_HEADERS.has(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    res.status(axiosResp.status).json(axiosResp.data);

  } catch (err) {
    console.error('❌ Nok Price Detail API error:', err?.response?.data || err.message);

    res.status(err?.response?.status || 500).json({
      message: 'Failed to retrieve price details',
      details: err?.response?.data || err.message
    });
  }
});

module.exports = router;
