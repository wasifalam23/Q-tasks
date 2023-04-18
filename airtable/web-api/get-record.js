const base = require('./at-base');

const table = base('Table 1');

table.find('recC2ubZA8AtzBpLO', (err, record) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('🆔', record.id);
});
