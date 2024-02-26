const exportPdf = async (drive, fileId, mimeType) => {
	try {
		const result = await drive.files.export(
			{
				fileId: fileId,
				mimeType,
			},
			{ responseType: "arraybuffer" }
		);
		console.log(result.status);
		return result.data;
	} catch (err) {
		// TODO(developer) - Handle error
		throw err;
	}
};

module.exports = exportPdf;
