const fs = require('fs').promises;
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const { google } = require('googleapis');

const credentials = process.env;

const oAuth2Client = new google.auth.OAuth2({
  clientId: credentials.CLIENT_ID,
  clientSecret: credentials.CLIENT_SECRET,
  redirectUri: credentials.REDIRECT_URI,
});

oAuth2Client.setCredentials({ refresh_token: credentials.REFRESH_TOKEN });

const gmail = google.gmail({
  version: 'v1',
  auth: oAuth2Client,
});

const getMessage = async (msgId) => {
  try {
    const message = await gmail.users.messages.get({
      userId: 'me',
      id: msgId,
      format: 'full',
    });

    console.log(JSON.stringify(message.data.payload.body.data, null, 4));

    const { snippet: mailBody, payload } = message.data;
    const { headers } = payload;

    const { value: sender } =
      headers.find((header) => header.name === 'From') || {};
    const { value: receiver } =
      headers.find((header) => header.name === 'To') || {};
    const { value: subject } =
      headers.find((header) => header.name === 'Subject') || {};

    const data = {
      sender,
      receiver,
      subject,
      mailBody,
    };

    return data;
  } catch (err) {
    console.log(err);
  }
};

const getHistory = async () => {
  try {
    const res = await gmail.users.history.list({
      startHistoryId: process.env.HISTORY_ID,
      userId: 'me',
      labelId: ['UNREAD'],
      historyTypes: ['messageAdded'],
    });

    // console.log(JSON.stringify(res.data, null, 4));

    if (!res.data.history || res.data.history.length === 0) return;
    const messageIds = res.data.history.flatMap((thread) => {
      if (thread.hasOwnProperty('messagesAdded')) {
        return thread.messagesAdded.map((message) => message.message.id);
      } else {
        return [];
      }
    });

    const msgIds = [...new Set(messageIds)];

    const lastMsgId = msgIds[msgIds.length - 1];
    const data = await getMessage(lastMsgId);

    return data;
  } catch (err) {
    console.log('💥Error: ', err);
  }
};

exports.handler = async (event) => {
  try {
    const data = await getHistory();
    console.log(data);

    // TODO implement
    const response = {
      statusCode: 200,
      body: JSON.stringify('Email Received'),
    };
    return response;
  } catch (err) {
    console.log('💥Error', err);
  }
};
