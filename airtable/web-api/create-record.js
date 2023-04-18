const base = require('./at-base');

const table = base('Table 1');

table.create(
  [
    {
      fields: {
        FirstName: 'Emily',
        LastName: 'Smith',
        Status: 'Todo',
      },
    },
  ],
  (err, records) => {
    if (err) {
      console.log(err);
      return;
    }

    records.forEach((record) => {
      `Record with id:${record.getId()} is created successfully ✅`;
    });
  }
);
