const stream = require("stream");

exports.getDrivePermisssion = async (drive, auth, fileId) => {
	try {
		await drive.permissions.create({
			auth,
			fileId,
			requestBody: {
				role: "reader",
				type: "anyone",
			},
		});
	} catch (err) {
		throw err;
	}
};

exports.getFileFromDrive = async (drive, fileId) => {
	try {
		const response = await drive.files.get(
			{
				fileId,
				alt: "media",
			},
			{ responseType: "arraybuffer" }
		);

		return response.data;
	} catch (error) {
		throw error;
	}
};

exports.uploadFileToDrive = async (
	drive,
	folderId,
	fileBuf,
	fileName,
	mimeType
) => {
	try {
		// Convert the PDF buffer to a readable stream
		const bufferStream = new stream.PassThrough();
		bufferStream.end(fileBuf);

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

		return respose.data.id;
	} catch (error) {
		throw error;
	}
};

exports.deleteFileFromDrive = async (drive, fileId) => {
	try {
		const respose = await drive.files.delete({
			fileId,
		});

		return respose;
	} catch (error) {
		throw error;
	}
};
