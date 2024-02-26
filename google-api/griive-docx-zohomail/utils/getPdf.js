const axios = require("axios");
const fs = require("fs");

const getPdf = async (fileId) => {
	try {
		const res = await axios({
			url: `https://docs.google.com/document/d/${fileId}/export?format=pdf`,
			method: "GET",
			responseType: "arraybuffer",
		});

		console.log("reddd🔥", res.data);
		fs.writeFile("output.pdf", res.data, function (err) {
			if (err) {
				console.error("Error saving PDF file:", err);
			} else {
				console.log("PDF file saved successfully.");
			}
		});
		return res.data;
	} catch (err) {
		throw err;
	}
};

module.exports = getPdf;
