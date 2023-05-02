const { google } = require('googleapis');
const authorize = require('./auth');

const authorizeGmail = async () => {
  try {
    const auth = await authorize();
    const gmail = google.gmail({ version: 'v1', auth });
    return gmail;
  } catch (err) {
    console.error(err);
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

const listLabels = async () => {
  const gmail = await authorizeGmail();
  const res = await gmail.users.labels.list({
    userId: 'me',
  });
  const labels = res.data.labels;
  if (!labels || labels.length === 0) {
    console.log('No labels found.');
    return;
  }
  console.log(labels);
  console.log('Labels:');
  labels.forEach((label) => {
    console.log(`- ${label.name}`);
  });
};

const connetPubSub = async () => {
  try {
    const gmail = await authorizeGmail();
    const res = await gmail.users.watch({
      userId: 'me',
      requestBody: {
        labelIds: ['UNREAD'], // useless, a bug on the api
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
      userId: 'me',
    });

    console.log(res);
  } catch (err) {
    console.log('💥Error: ', err);
  }
};

const history = { historyId: '1019733', expiration: '1683641227837' }; // => new connect (16:26)

const getHistory = async () => {
  try {
    const gmail = await authorizeGmail();
    const res = await gmail.users.history.list({
      startHistoryId: history.historyId,
      userId: 'me',
      labelId: ['UNREAD'],
      historyTypes: ['messageAdded'],
    });

    console.log(JSON.stringify(res.data, null, 4));

    if (!res.data.history || res.data.history.length === 0) return;
    const messageIds = res.data.history.flatMap((thread) => {
      if (thread.hasOwnProperty('messagesAdded')) {
        return thread.messagesAdded.map((message) => message.message.id);
      } else {
        return [];
      }
    });

    console.log([...new Set(messageIds)]);
  } catch (err) {
    console.log('💥Error: ', err);
  }
};

const getMessage = async () => {
  try {
    const gmail = await authorizeGmail();
    const message = await gmail.users.messages.get({
      userId: 'me',
      id: '187dce434963126a',
      format: 'full',
    });

    if (process.argv[3] === '-full') {
      console.log(message);
    }

    const { payload } = message.data;
    const { headers } = payload;

    const { body } = message.data.payload.parts.find(
      (item) => item.mimeType === 'text/plain' || {}
    );

    const mailBody = `${Buffer.from(body.data, 'base64')}`.replace(
      /\r?\n|\r|\+/g,
      ''
    );

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
  case '--get-list':
    listLabels();
    break;
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
