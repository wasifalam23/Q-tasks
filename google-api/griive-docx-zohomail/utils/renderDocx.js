const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");

const renderDocx = async (docContent, data) => {
	try {
		// Manipulate the docx data
		const bufferContent = Buffer.from(docContent, "base64");
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

		// const pdfBuf = await convertAsync(docxBuf, ".pdf", undefined);
		return docxBuf;
	} catch (error) {
		console.error("Error rendering DOCX and converting to PDF:", error);
		throw error; // Re-throw the error to propagate it to the caller
	}
};

module.exports = renderDocx;
