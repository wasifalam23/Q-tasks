const base = require('./at-base');

const table = base('Ice Cream');

table
  .select({
    maxRecords: 4,
    view: 'Grid view',
    filterByFormula: '{Flavor}="Vanilla"',
  })
  .eachPage(
    (records, fetchNextPage) => {
      records.forEach((record) => {
        console.log(record.get('Flavor'));
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
