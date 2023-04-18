const fs = require('fs');
const pdf = require('pdf-parse');

async function main() {
  try {
    let pdfBuffer = fs.readFileSync('./assets/pdfTask1.pdf');

    let result = await pdf(pdfBuffer);
    result = result.text.split('\n');

    let dataStartIndex;

    // identify starting index of your table
    for (let i = 0; i < result.length; i++) {
      // get current row
      let currentRow = result[i];
      if (currentRow.toLowerCase().startsWith('name')) {
        dataStartIndex = i + 1;
      }
    }

    let employeeList = [];

    for (let i = dataStartIndex; i < result.length; i++) {
      let currentRow = result[i].trim();

      currentRow = currentRow.split(' ');

      let name, designation, joiningDate, activeProjects;

      name = currentRow[0];
      designation = currentRow.slice(1, currentRow.length - 2).join(' ');
      joiningDate = currentRow[currentRow.length - 2];
      activeProjects = currentRow[currentRow.length - 1];

      employeeList.push({
        name,
        designation,
        joiningDate,
        activeProjects,
      });
    }

    console.log(employeeList);
  } catch (error) {
    console.log(error);
  }
}

main();
/*

[
  [ 'INVOICE' ],
  [ 'Invoice#', '003' ],
  [ 'Date:', '16/01/2023' ],
  [ 'Yousuf' ],
  [ 'Uttar', 'Pradesh,', 'India' ],
  [ 'Phone:', '+91', '1234567890' ],
  [ 'PURCHASED', 'BY:' ],
  [ 'Qualyval', 'Ltd', '' ],
  [ '27', 'Montague', 'Crescent' ],
  [ 'Brooklands' ],
  [ 'Milton', 'Keynes,', 'MK107LN' ],
  [ 'Phone:', '+44', '1234567', '' ],
  [ 'QUANTITY' ],
  [ 'DESCRIPTION' ],
  [ 'UNIT', 'PRICE' ],
  [ 'TOTAL' ],
  [ '1' ],
  [ 'Developer_', 'Jan', '2023', '' ],
  [ 'INR', '10000' ],
  [ '10000.00' ],
  [ 'Subtotal' ],
  [ 'Salestax' ],
  [ 'Shipping', 'and', 'Hnadling' ],
  [ 'TOTAL', 'DUE' ],
  [ '10000.00' ],
  [ '0.00' ],
  [ '0.00' ],
  [ 'INR', '10000.00' ],
  [ 'Account', 'Holder', 'Name:', 'Yousuf' ],
  [ 'Account', 'Number:', 'XXXXXXXXXXXXXX' ],
  [ 'IFSC:', 'XXXXX' ],
  [ 'Account', 'Type:', 'XXXXXXX' ],
  [ 'Bank', 'Name:', 'XXXXXX' ]
]

*/

/*
const invoiceData = {
  invoice: {
    invoiceNo: dataArr[1][1],
    date: dataArr[2][1],
    name: dataArr[3][0],
    address: dataArr[4].join(' '),
    phone: dataArr[5].slice(1).join(' '),
  },

  purchase: {
    purchasedBy: dataArr[7].join(' ').trim(),
    address: `${dataArr[8].join(' ')}, ${dataArr[9].join(
      ' '
    )}, ${dataArr[10].join(' ')}`,
    phone: dataArr[11].slice(1).join(' ').trim(),
  },

  tableData: {},
};
*/
