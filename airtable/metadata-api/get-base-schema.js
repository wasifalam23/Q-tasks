const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });

const config = require('./authorization');

axios
  .get(
    `https://api.airtable.com/v0/meta/bases/${process.env.At_Base}/tables`,
    config
  )
  .then((res) => {
    console.log('📊', res.data);
  })
  .catch((err) => {
    console.log('💥', err.message);
  });
