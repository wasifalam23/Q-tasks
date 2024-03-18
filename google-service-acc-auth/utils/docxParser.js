const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");

const parseDocx = (docContent, data) => {
	try {
		// Manipulate the docx data
		const bufferContent = Buffer.from(docContent, "binary");
		const zip = new PizZip(bufferContent);

		const doc = new Docxtemplater(zip, {
			paragraphLoop: true,
			linebreaks: true,
		});

		doc.render(data);

		const docxBuf = doc.getZip().generate({
			type: "nodebuffer",
			compression: "DEFLATE",
		});

		return docxBuf;
	} catch (error) {
		throw error;
	}
};

module.exports = parseDocx;
