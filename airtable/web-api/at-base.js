require('dotenv').config({ path: '../config.env' });
const Airtable = require('airtable');

const base = new Airtable({
  apiKey: process.env.At_Personal_Access_Token,
}).base(process.env.At_Base);

module.exports = base;
