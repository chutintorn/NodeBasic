const axios = require('axios');
let data = JSON.stringify({
  "agencyCode": "",
  "flightFareKey": [
    {
      "fareKey": "CNXDMK20250627020002THB_13:WRALIT00",
      "journeyKey": "CNXDMK20250627020002THB_DD400820250627"
    }
  ],
  "includeExtraServices": true
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://uat-ota.nokair.com/v1/pricing-details',
  headers: { 
    'X-Correlation-Id': '9a6f444c-e4ea-44cb-88ca-a680a95dae43', 
    'client_id': '887eb5c3d01e4cf192404b731ee2eb27', 
    'client_secret': 'A3B4033E52bE44C5B84c6869b4bd4Bd1', 
    'Content-Type': 'application/json', 
    'security-token': '7d65ci66892ancj0u9440361u0kb40bb13864d3385f3'
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
