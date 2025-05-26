const express = require('express');
const cors    = require('cors');

// 📦 import routes
const flightsRoute     = require('./routes/flights');
const priceDetailsRoute = require('./routes/pricedetails');  // 🆕

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/flights', flightsRoute);
app.use('/pricedetails', priceDetailsRoute);                  // 🆕

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
  console.log(`✈️ Server listening on http://localhost:${PORT}/flights`);
  console.log(`💲 Price details at   http://localhost:${PORT}/pricedetails`);
});
