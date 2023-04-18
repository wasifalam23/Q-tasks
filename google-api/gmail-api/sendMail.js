const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const { client_id, client_secret, redirect_uris, refresh_token } =
  require('../credentials-gmail.json').web;

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

oAuth2Client.setCredentials({ refresh_token });

async function sendMail() {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAUTH2',
        user: 'wsfalam84@gmail.com',
        clientId: client_id,
        clientSecret: client_secret,
        refreshToken: refresh_token,
        accessToken,
      },
    });

    const mailOptions = {
      from: 'WasifAlam 📧 <wsfalam84@gmail.com>',
      to: 'wsfalam55@gmail.com',
      subject: 'Test from Wasif_Alam',
      text: 'Sending a mail from gmail api using nodejs',
      html: '<h1>Sending a mail from gmail api using nodejs</h1>',
      attachments: [
        {
          filename: 'Dummy Pdf File',
          content: fs.createReadStream(
            path.join(__dirname, '../assets/dummy.pdf')
          ),
        },
        {
          filename: 'Dummy Png File',
          content: fs.createReadStream(
            path.join(__dirname, '../assets/fff.png')
          ),
        },
      ],
    };

    const result = await transport.sendMail(mailOptions);

    return result;
  } catch (error) {
    return error;
  }
}

sendMail()
  .then((result) => console.log('Email sent...', result))
  .catch((error) => console.log('Error:💥', error.message));
