const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const credentials = require('../credentials-gdrive.json');

const { client_secret, client_id, redirect_uris, refresh_token } =
  credentials.web;

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

oAuth2Client.setCredentials({ refresh_token });

const drive = google.drive({
  version: 'v3',
  auth: oAuth2Client,
});

const filePath = path.join(__dirname, '../assets/fff.png');

//////////////////////////////////////////////
// 1) Creating a folder on drive
const createFolder = async (folderName) => {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id',
    });

    console.log('Folder ID:', response.data.id);
    return response.data.id;
  } catch (err) {
    console.log(err.message);
  }
};

//////////////////////////////////////////////
// 2) Uploading a file to a particular folder on drive
const uploadFileToFolder = async (folderId) => {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: 'dummy-test.png',
        parents: [folderId],
      },

      media: {
        mimeType: 'image/png',
        body: fs.createReadStream(path.join(__dirname, 'fff.png')),
      },
    });

    console.log(response.data);
  } catch (err) {
    console.log(err.message);
  }
};

//////////////////////////////////////////////
// 3) Uploading a file to drive
const uploadFile = async () => {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: 'dummy-test.png',
        mimeType: 'image/png',
      },

      media: {
        mimeType: 'image/png',
        body: fs.createReadStream(filePath),
      },
    });

    console.log(response.data);
  } catch (err) {
    console.log(err.message);
  }
};

//////////////////////////////////////////////
// 4) Deleteing a folder from the drive
const deleteFolder = async function (folderId) {
  try {
    const response = await drive.files.delete({
      fileId: folderId,
    });

    console.log(response.data, response.status);
  } catch (err) {
    console.log(err.message);
  }
};

//////////////////////////////////////////////
// 5) Deleting a file from the drive
const deleteFile = async function (fileId) {
  try {
    const response = await drive.files.delete({
      fileId,
    });

    console.log(response.data, response.status);
  } catch (err) {
    console.log(err.message);
  }
};

///////////////////////////////////////////////
// Executing Fucntions according to commands
const command = process.argv[2];

if (command === '--create-folder') {
  createFolder('Wasif_Demo'); //FolderName
} else if (command === '--upload-file-folder') {
  uploadFileToFolder('1rFr99QRllxbQUIaDkoOMAjJAA9W12YBr'); //FolderId
} else if (command === '--upload-file') {
  uploadFile();
} else if (command === '--delete-folder') {
  deleteFolder('1rFr99QRllxbQUIaDkoOMAjJAA9W12YBr'); //FolderId
} else if (command === '--delete-file') {
  deleteFile(); //FileId
}
