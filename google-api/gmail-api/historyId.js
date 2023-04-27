const historyObj = {
  history: [
    {
      id: '1005952',
      messages: [
        {
          id: '187b2eacd0eae67f',
          threadId: '187b2eacd0eae67f',
        },
      ],
      messagesAdded: [
        {
          message: {
            id: '187b2eacd0eae67f',
            threadId: '187b2eacd0eae67f',
            labelIds: ['UNREAD', 'CATEGORY_PERSONAL', 'INBOX'],
          },
        },
      ],
    },
    {
      id: '1006081',
      messages: [
        {
          id: '187b2faaa4d9ffbe',
          threadId: '187b2faaa4d9ffbe',
        },
      ],
      messagesAdded: [
        {
          message: {
            id: '187b2faaa4d9ffbe',
            threadId: '187b2faaa4d9ffbe',
            labelIds: ['UNREAD', 'CATEGORY_PERSONAL', 'INBOX'],
          },
        },
      ],
    },
    {
      id: '1006081',
      messages: [
        {
          id: '187b2faaa4d9ffbe',
          threadId: '187b2faaa4d9ffbe',
        },
      ],
      messagesAdded: [
        {
          message: {
            id: '187b2faaa4d9ffbe',
            threadId: '187b2faaa4d9ffbe',
            labelIds: ['UNREAD', 'CATEGORY_PERSONAL', 'INBOX'],
          },
        },
      ],
    },
    {
      id: '1006084',
      messages: [
        {
          id: '187b2faaa4d9ffbe',
          threadId: '187b2faaa4d9ffbe',
        },
      ],
    },
  ],
  historyId: '1006133',
};

const messageIds = historyObj.history.flatMap((thread) => {
  if (thread.hasOwnProperty('messagesAdded')) {
    return thread.messagesAdded.map((message) => message.message.id);
  } else {
    return [];
  }
});

console.log([...new Set(messageIds)]);
