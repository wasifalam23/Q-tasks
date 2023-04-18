const base = require('./at-base');

const table = base('Contacts');

table
  .select({
    maxRecords: 3,
    view: 'Grid view',
    // filterByFormula: `AND(LEN(FirstName) = 5, LEN(LastName) = 3)`,
    // filterByFormula: `FirstName != 'Kevin'`,
    // filterByFormula: `RECORD_ID() = 'rec1sms4EdAAHdzV8'`,
    returnFieldsByFieldId: true,
  })
  .eachPage(
    (records, fetchNextPage) => {
      records.forEach((record) => {
        console.log(record.fields);
      });

      fetchNextPage();
    },
    (err) => {
      if (err) {
        console.log(err);
        return;
      }
    }
  );
