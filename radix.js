const axios = require('axios');
let data = '{\r\n    "agencyCode": "OTAINMMT",\r\n    "currency": "INR",\r\n    "adult": 1,\r\n    "child":0,\r\n    "infant":0,\r\n    "journeys": [\r\n        {\r\n            "origin": "BOM",\r\n            "destination": "CNX",\r\n            "departureDate": "2025-04-26"\r\n        }\r\n    ]\r\n}';

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://uat-ota.nokair.com/v1/available-flight-fare',
  headers: { 
    'X-Correlation-Id': '560ef011-3b8f-48c0-b5e8-d49000ddd607', 
    'client_id': '887eb5c3d01e4cf192404b731ee2eb27', 
    'client_secret': 'A3B4033E52bE44C5B84c6869b4bd4Bd1'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
