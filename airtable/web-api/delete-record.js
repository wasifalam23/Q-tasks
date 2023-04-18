const base = require('./at-base');

const table = base('Table 1');

table.destroy(['recgUWrhPFI49LE6T'], (err, deletedRecords) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`🗑️Successfully Deleted ${deletedRecords.length} records`);
});
