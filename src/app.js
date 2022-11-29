const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const axios = require('axios');

require('dotenv').config();

const middlewares = require('./middlewares');

const app = express();

const extract = (data, where) => {
  var g = where || (typeof global !== 'undefined' ? global : this);
  for (var key in data){
    if (data.hasOwnProperty(key)){
        g[key] = data[key];
    }
  }
}

const createBroadcast = async (headers, title, workspaceId, selectedBrandId, csrfToken) => {
  const url = `https://streamyard.com/api/workspaces/${workspaceId}/broadcasts`;

  headers['content-type'] = 'application/json';

  const data = { title, "recordOnly": false, selectedBrandId, "type": "studio", csrfToken, localIsolatedRecordings : null };
  console.log(data);

  try {
      const result = await axios.post(url, data, { headers });
      console.log(result.data);
      return result.data.id;
  } catch (error) {
      console.log(error);
  }
}

const createDestination = async (headers, title, description, broadcastId, privacy, destinationId, plannedStartTime, csrfToken) => {
  const url = `https://streamyard.com/api/broadcasts/${broadcastId}/destinations`;

  const boundary = '----WebKitFormBoundary';
  const boundaryData = '--' + boundary;

  headers['content-type'] = `multipart/form-data; boundary=${boundary}`;
    
  const data = `${boundaryData}\r\nContent-Disposition: form-data; name=\"title\"\r\n\r\n${title}\r\n${boundaryData}\r\nContent-Disposition: form-data; name=\"description\"\r\n\r\n${description}\r\n${boundaryData}\r\nContent-Disposition: form-data; name=\"privacy\"\r\n\r\n${privacy}` + (plannedStartTime ? `\r\n${boundaryData}\r\nContent-Disposition: form-data; name=\"plannedStartTime\"\r\n\r\n${plannedStartTime}` : ``) + `\r\n${boundaryData}\r\nContent-Disposition: form-data; name=\"destinationId\"\r\n\r\n${destinationId}\r\n${boundaryData}\r\nContent-Disposition: form-data; name=\"csrfToken\"\r\n\r\n${csrfToken}\r\n${boundaryData}--\r\n`;
  console.log(data);

  try {
      const result = await axios.post(url, data, { headers });
      console.log(result.data);
      return result.data.output;
  } catch (error) {
      console.log(error);
  }
}

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());  


app.post('/', async (req, res) => {

  extract(req.body)

  let headers = {
    'authority': 'streamyard.com',
    'accept': '*/*',
    "accept-language": "en-GB,en;q=0.6",
    "cookie": `${cookies}`,
    "Origin": "https://streamyard.com",
    "Referer": `${referer}`,
    "Referrer-Policy": "origin-when-cross-origin",
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'sec-gpc': '1',
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
  };

  const broadcastId = await createBroadcast(headers, title, workspaceId, selectedBrandId, csrfToken)

  const destination = await createDestination(headers, title, description, broadcastId, privacy, destinationId, plannedStartTime, csrfToken)

  res.json({
    inviteLink: 'https://streamyard.com/' + destination.broadcastId,
    youtubeUrl: destination.platformLink,
  });
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
