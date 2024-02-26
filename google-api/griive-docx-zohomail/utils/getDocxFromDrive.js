const getDocxFromDrive = async (drive, fileId) => {
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
		throw err;
	}
};

module.exports = getDocxFromDrive;
