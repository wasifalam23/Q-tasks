const { google } = require('googleapis');
const authorize = require('./auth');

const authorizeGmail = async () => {
  try {
    const auth = await authorize();
    const gmail = google.gmail({ version: 'v1', auth });
    return gmail;
  } catch (err) {
    console.err(err);
  }
};

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
    const gmail = await authorizeGmail();
    const res = await gmail.users.watch({
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
    const gmail = await authorizeGmail();
    const res = await gmail.users.stop({
      userId: 'wsfalam84@gmail.com',
    });

    console.log(res);
  } catch (err) {
    console.log('💥Error: ', err);
  }
};

const getHistory = async () => {
  try {
    const gmail = await authorizeGmail();
    const res = await gmail.users.history.list({
      userId: 'wsfalam84@gmail.com',
      startHistoryId: 999855,
    });

    console.log(JSON.stringify(res.data, null, 4));
  } catch (err) {
    console.log('💥Error: ', err);
  }
};

const getMessage = async () => {
  try {
    const gmail = await authorizeGmail();
    const message = await gmail.users.messages.get({
      userId: 'wsfalam84@gmail.com',
      id: '1879d6d4c7d33df7',
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
