// routes/pricedetails.js
const express = require('express');
const router  = express.Router();

/**
 * GET /pricedetails
 * Query parameters you might support later:
 *   - origin
 *   - destination
 *   - date
 *   - cabinClass
 */
router.get('/', (req, res) => {
  // Placeholder response – replace with real logic later
  res.json({
    success: true,
    message: '📊 Price Details API is ready.',
    query: req.query            // echoes any ?params you send
  });
});

module.exports = router;
