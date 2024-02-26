const google = require("@googleapis/drive");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

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

async function downloadPdf(pdflink, pdfFileName) {
	const writer = fs.createWriteStream(`/tmp/${pdfFileName}.pdf`);

	const res = await axios({
		url: pdflink,
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
	// res.data.pipe(writer);
	// return new Promise((resolve, reject) => {
	// 	writer.on("finish", resolve);
	// 	writer.on("error", reject);
	// });
}

const pdfhandler = async (folderID, fileId, pdfFileName) => {
	await drive.permissions.create({
		auth: oAuth2Client,
		fileId: fileId,
		requestBody: {
			role: "reader",
			type: "anyone",
		},
	});

	const pdflink = `https://docs.google.com/document/d/${fileId}/export?format=pdf`;

	try {
		await downloadPdf(pdflink, pdfFileName);

		// var fileMetadata = {
		// 	name: pdfFileName + ".pdf",
		// 	parents: [folderID],
		// };

		// var media = {
		// 	mimeType: "application/pdf",
		// 	body: fs.createReadStream(path.join("/tmp", pdfFileName + ".pdf")),
		// };
		// const pdfRes = await drive.files.create({
		// 	resource: fileMetadata,
		// 	media: media,
		// 	fields: "id",
		// });
		// console.log("Pdf Id", pdfRes.data.id);
		// console.log("Finished pdf");
	} catch (err) {
		console.log("Download error");
		throw err;
	}
};

pdfhandler(
	"1idVC_pWc68ITGM8WbiDTm5M-SfZ38Vbo",
	"1idVC_pWc68ITGM8WbiDTm5M-SfZ38Vbo",
	"new.pdf"
);
