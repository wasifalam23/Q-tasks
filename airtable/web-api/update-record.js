const base = require('./at-base');

const table = base('Table 1');

table.update(
  [
    {
      id: 'recpVyDfJCGxgO6pP',
      fields: {
        lastName: 'Smith',
        Status: 'In progress',
      },
    },
  ],
  (err, records) => {
    if (err) {
      console.log(err);
      return;
    }
    records.forEach((record) => {
      console.log(
        `Record with id:${record.getId()} is updated successfully ✅`
      );
    });
  }
);
