const { google } = require('googleapis');
const { gmail } = require('googleapis/build/src/apis/gmail');

const { client_id, client_secret, redirect_uris, refresh_token } =
  require('../credentials-gmail.json').web;

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

oAuth2Client.setCredentials({ refresh_token });
const { users } = google.gmail({ version: 'v1', auth: oAuth2Client });

/*
const getMessageList = async () => {
  try {
    const messageList = await users.messages.list({
      q: 'label:inbox is:unread category:primary',
      userId: 'wsfalam84@gmail.com',
    });

    console.log(messageList.data.messages);
  } catch (err) {
    console.log(err);
  }
};
*/

const connetPubSub = async () => {
  try {
    const res = await users.watch({
      userId: 'wsfalam84@gmail.com',
      requestBody: {
        labelIds: ['INBOX'],
        labelFilterAction: 'include',
        topicName: 'projects/learning-gmail-api-nodejs/topics/gmail-topic',
      },
    });

    console.log(res.data);
  } catch (err) {
    console.log('💥Error: ', err);
  }
};

const stopPubSub = async () => {
  try {
    const res = await users.stop({
      userId: 'wsfalam84@gmail.com',
    });

    console.log(res);
  } catch (err) {
    console.log('💥Error: ', err);
  }
};

const getHistory = async () => {
  try {
    const res = await users.history.list({
      userId: 'wsfalam84@gmail.com',
      startHistoryId: 998036,
    });

    console.log(JSON.stringify(res.data, null, 4));
  } catch (err) {
    console.log('💥Error: ', err);
  }
};

const getMessage = async () => {
  try {
    const message = await users.messages.get({
      userId: 'wsfalam84@gmail.com',
      id: '187998ff04a4fc3f',
      format: 'full',
    });

    if (process.argv[3] === '-full') {
      console.log(message);
    }

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

    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

switch (process.argv[2]) {
  case '--connect':
    connetPubSub();
    break;
  case '--stop':
    stopPubSub();
    break;
  case '--get-history':
    getHistory();
    break;
  case '--get-message':
    getMessage();
    break;
}
