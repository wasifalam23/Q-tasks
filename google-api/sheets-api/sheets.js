const { google } = require('googleapis');
const credentials = require('../credentials-sheets.json');

const { client_id, client_secret, redirect_uris, refresh_token } =
  credentials.web;

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

oAuth2Client.setCredentials({ refresh_token });

const sheets = google.sheets({
  version: 'v4',
  auth: oAuth2Client,
});

//////////////////////////////////////////////
// 1) Get spreadsheet by ID
const getSheetById = async () => {
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: '1FKk6kOQ8fZz4yCMNEpfU0TqvPFmaPP3ztQKMzC9QLy8',
      ranges: ['Sheet1!A1:D1'],
      includeGridData: true,
    });

    const rowData = response.data.sheets[0].data[0].rowData;
    console.log(response);

    // rowData.forEach((data) => {
    //   console.log(data.values);
    // });
  } catch (err) {
    console.log(err);
  }
};

//////////////////////////////////////////////
// 2) Get spreadsheet values by ID
const getSheetValuesById = async () => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: '1FKk6kOQ8fZz4yCMNEpfU0TqvPFmaPP3ztQKMzC9QLy8',
      range: 'Sheet2',
    });

    console.log(response.data.values);
  } catch (err) {}
};

//////////////////////////////////////////////
// 3) Create spreadsheet
const createSheet = async () => {
  const request = {
    resource: {
      properties: {
        title: 'demo2',
      },
    },
  };

  try {
    const spreadsheet = await sheets.spreadsheets.create(request);

    console.log(spreadsheet);
  } catch (err) {
    console.log(err);
  }
};

//////////////////////////////////////////////
// 4) Write spreadsheet values
const writeSheetValues = async () => {
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: '1mx-mTRs4H0FgkmVBs11KDylhZx2o1LtAUHoyR4JR4M0',
      range: 'Sheet1!A7:B7',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [['TestF', 'TestL', 'test@test.com', 'testO']],
      },
    });

    console.log(response);
  } catch (err) {
    console.log(err);
  }
};

//////////////////////////////////////////////
// 4) Update spreadsheet values
const updateSheetValues = async () => {
  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: '1mx-mTRs4H0FgkmVBs11KDylhZx2o1LtAUHoyR4JR4M0',
      range: 'Sheet1',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [['Test', 'Test', 'test@test.com', 'test']],
      },
    });

    console.log(response);
  } catch (err) {
    console.log(err);
  }
};

//////////////////////////////////////////////
// 5) Clear spreadsheet values by batch (one or more ranges of values)
const clearSheetValuesByBatch = async () => {
  try {
    const response = await sheets.spreadsheets.values.batchClear({
      spreadsheetId: '1mx-mTRs4H0FgkmVBs11KDylhZx2o1LtAUHoyR4JR4M0',
      resource: {
        ranges: ['Sheet1!A1'],
      },
    });

    console.log(response);
  } catch (err) {
    console.log(err);
  }
};

///////////////////////////////////////////////
// Executing Fucntions according to commands
const command = process.argv[2];

if (command === '--get-sheet') {
  getSheetById();
} else if (command === '--get-sheet-values') {
  getSheetValuesById();
} else if (command === '--create-sheet') {
  createSheet();
} else if (command === '--write-sheet') {
  writeSheetValues();
} else if (command === '--update-sheet') {
  updateSheetValues();
} else if (command === '--clear-sheet') {
  clearSheetValuesByBatch();
}
