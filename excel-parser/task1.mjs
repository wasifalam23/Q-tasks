import xlsx from 'node-xlsx';
import path from 'path';

const workSheetsFromFile = xlsx.parse(
  path.join(process.cwd(), '/assets/Excel task 1.xlsx')
);

const sheetData = workSheetsFromFile[0].data;

const sheetList = { name: workSheetsFromFile[0].name, data: [] };

for (let i = 1; i < sheetData.length; i++) {
  const currentRow = sheetData[i];

  const obj = {};
  for (let j = 0; j < sheetData[0].length; j++) {
    const key = sheetData[0][j]
      .split(' ')
      .filter((word) => word.match(/^[a-zA-Z0-9]+$/))
      .map((word, index) => {
        if (index === 0) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join('');

    obj[key] = currentRow[j];
  }

  sheetList.data.push(obj);
}

console.log(sheetList.data);
