const fs = require("fs");

const writeFile = (buf) => {
	fs.writeFile("input.pdf", buf, function (err) {
		if (err) {
			console.error("Error saving PDF file:", err);
		} else {
			console.log("PDF file saved successfully.");
		}
	});
};

module.exports = writeFile;
