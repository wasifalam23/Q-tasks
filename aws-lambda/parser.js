const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

exports.parser = async () => {
  try {
    let pdfBuffer = fs.readFileSync(
      path.join(process.cwd(), 'assets/pdfTask1.pdf')
    );

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

    return employeeList;
  } catch (error) {
    console.log(error);
  }
};
