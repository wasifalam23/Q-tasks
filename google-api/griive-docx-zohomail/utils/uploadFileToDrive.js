const stream = require("stream");

const uploadFileToDrive = async (drive, folderId, buf, fileName, mimeType) => {
	try {
		// Convert the PDF buffer to a readable stream
		const bufferStream = new stream.PassThrough();
		bufferStream.end(buf);

		// Upload the PDF file to Google Drive
		const respose = await drive.files.create({
			requestBody: {
				name: fileName,
				parents: [folderId],
			},
			media: {
				mimeType,
				body: bufferStream,
			},
		});
		console.log("Docx is saved to drive ✅");
		return respose;
	} catch (err) {
		throw err;
	}
};

module.exports = uploadFileToDrive;

// "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
