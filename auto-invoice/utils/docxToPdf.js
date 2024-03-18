const axios = require("axios");

const docxToPdf = async (fileId) => {
	try {
		const res = await axios({
			url: `https://docs.google.com/document/d/${fileId}/export?format=pdf`,
			method: "GET",
			responseType: "arraybuffer",
		});

		return res.data;
	} catch (err) {
		throw err;
	}
};

module.exports = docxToPdf;
