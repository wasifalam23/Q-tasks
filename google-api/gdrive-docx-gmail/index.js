const { promisify } = require("util");
const { google } = require("googleapis");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const libre = require("libreoffice-convert");
const nodemailer = require("nodemailer");
const stream = require("stream");

const convertAsync = promisify(libre.convert);

const credentials = require("./credentials-gmail.json");

const { client_secret, client_id, redirect_uris, refresh_token } =
	credentials.web;

const oAuth2Client = new google.auth.OAuth2(
	client_id,
	client_secret,
	redirect_uris[0]
);

oAuth2Client.setCredentials({ refresh_token });

const drive = google.drive({
	version: "v3",
	auth: oAuth2Client,
});

const user = {
	id: "65c62cc56d946390235dabf6346",
	Name: "Wasif_Alam",
	Age: 26,
	Email: "wsfalam55@gmail.com",
};

//////////////////////////////////////////////
const uploadPdfToDrive = async (folderId, pdfBuf, fileName) => {
	// Convert the PDF buffer to a readable stream
	const bufferStream = new stream.PassThrough();
	bufferStream.end(pdfBuf);

	// Upload the PDF file to Google Drive
	await drive.files.create({
		requestBody: {
			name: fileName,
			parents: [folderId],
		},
		media: {
			mimeType: "application/pdf",
			body: bufferStream,
		},
	});
};

//////////////////////////////////////////////
// Uploading a file to a particular folder on drive
const uploadFileToFolder = async (folderId, pdfBuf1, pdfBuf2, user) => {
	try {
		await Promise.all([
			uploadPdfToDrive(folderId, pdfBuf1, `${user.Name}-${user.id}-1.pdf`),
			uploadPdfToDrive(folderId, pdfBuf2, `${user.Name}-${user.id}-2.pdf`),
		]);

		console.log("Attachments are saved to drive ✅");
	} catch (err) {
		console.error("Error uploading files to folder:", err);
		throw err;
	}
};

//////////////////////////////////////////////
// Send the attachment through Gmail just created as pdf
const sendMail = async (pdfBuf1, pdfBuf2, folderId) => {
	try {
		const accessToken = await oAuth2Client.getAccessToken();

		const transport = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAUTH2",
				user: "wsfalam84@gmail.com",
				clientId: client_id,
				clientSecret: client_secret,
				refreshToken: refresh_token,
				accessToken,
			},
		});

		const mailOptions = {
			from: "WasifAlam 📧 <wsfalam84@gmail.com>",
			to: user.Email,
			subject: "Test from Wasif_Alam",
			text: "Sending a mail from gmail api using nodejs",
			html: "<h1>Sending a mail from gmail api using nodejs</h1>",
			attachments: [
				{
					filename: "Template 1",
					content: pdfBuf1,
				},
				{
					filename: "Template 2",
					content: pdfBuf2,
				},
			],
		};

		await transport.sendMail(mailOptions);
		console.log("Mail is sent ✅");

		uploadFileToFolder(folderId, pdfBuf1, pdfBuf2, user);
	} catch (error) {
		console.log(error);
	}
};

//////////////////////////////////////////////
// Get the docx from the drive
const getDriveFile = async (fileId) => {
	try {
		const response = await drive.files.get(
			{
				fileId,
				alt: "media",
			},
			{ responseType: "arraybuffer" }
		);

		return response.data;
	} catch (err) {
		console.log(err);
	}
};

//////////////////////////////////////////////
// Function to render DOCX and convert to PDF
const renderDocxAndConvertToPdf = async (docContent) => {
	try {
		// Manipulate the docx data
		const bufferContent = Buffer.from(docContent, "base64");
		const zip = new PizZip(bufferContent);

		const doc = new Docxtemplater(zip, {
			paragraphLoop: true,
			linebreaks: true,
		});

		doc.render(user);

		const docxBuf = doc.getZip().generate({
			type: "nodebuffer",
			compression: "DEFLATE",
		});
		// Convert the docx to pdf
		const pdfBuf = await convertAsync(docxBuf, ".pdf", undefined);
		return pdfBuf;
	} catch (error) {
		console.error("Error rendering DOCX and converting to PDF:", error);
		throw error; // Re-throw the error to propagate it to the caller
	}
};

//////////////////////////////////////////////
// Manipulate the docx files and send emails using Promise.all
const manipulateDoc = async (fileId1, fileId2, folderId) => {
	try {
		// Fetch the docx files concurrently
		const [docx1, docx2] = await Promise.all([
			getDriveFile(fileId1),
			getDriveFile(fileId2),
		]);

		console.log("🤗", docx1, docx2);

		// Render and convert DOCX files to PDF concurrently
		const [pdfBuf1, pdfBuf2] = await Promise.all([
			renderDocxAndConvertToPdf(docx1),
			renderDocxAndConvertToPdf(docx2),
		]);

		console.log("👻", pdfBuf1, pdfBuf2);

		// Send emails with the PDF attachments
		// sendMail(pdfBuf1, pdfBuf2, folderId);
	} catch (error) {
		console.error("Error:", error);
		// Handle errors here
	}
};

///////////////////////////////////////////////
// Executing Fucntions according to commands
const command = process.argv[2];

if (command === "--send-mail") {
	manipulateDoc(
		"1nWlbivYIMNbbche7EfYaeyl0TAn4BDQj",
		"1LMUmYNv7ZditmkTQORT4VzZruFfc3oQI",
		"1nkvpUk2or3px_1Wg3niqG-c341JRnsfe"
	);
}
