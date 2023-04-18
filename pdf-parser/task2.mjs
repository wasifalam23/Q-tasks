import { PdfReader } from 'pdfreader';

const pdfReader = new PdfReader();

const pdfLines = [];
const data = [];

pdfReader.parseFileItems('./assets/pdfTask2.pdf', (err, item) => {
  if (err) console.error('error:', err);
  else if (!item) {
    const dataArr = pdfLines.map((item) => item.split(' '));

    const invoiceDataList = {
      invoiceNo: dataArr[1][1],
      date: dataArr[2][1],
      tableData: [],
      subTotal: dataArr[24][0],
      salesTax: dataArr[25][0],
      shippingAndHandling: dataArr[26][0],
      totalDue: dataArr[27][0],
    };

    let dataStartIndex;
    let dataEndIndex;
    for (let i = 0; i < pdfLines.length; i++) {
      let currentRow = pdfLines[i];

      if (currentRow.toLowerCase() === 'total') {
        dataStartIndex = i + 1;
      }

      if (currentRow.toLowerCase() === 'subtotal') {
        dataEndIndex = i;
      }
    }

    const diff = (dataEndIndex - dataStartIndex) / 4;

    for (let i = dataStartIndex; i < dataStartIndex + diff; i++) {
      const currentRow = pdfLines.slice(i, i + 4);

      let quantity, description, unitPrice, total;

      quantity = currentRow[0];
      description = currentRow[currentRow.length - 3];
      unitPrice = currentRow[currentRow.length - 2];
      total = currentRow[currentRow.length - 1];

      invoiceDataList.tableData.push({
        quantity,
        description,
        unitPrice,
        total,
      });
    }

    console.log(invoiceDataList);
  } else if (item.text) {
    const pdfText = item.text;

    pdfLines.push(pdfText);
  }
});
