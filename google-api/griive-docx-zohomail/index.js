const { google } = require("googleapis");
const renderDocx = require("./utils/renderDocx");
const getDocxFromDrive = require("./utils/getDocxFromDrive");
const uploadFileToDrive = require("./utils/uploadFileToDrive");
const credentials = require("./credentials-gmail.json");
const getPdf = require("./utils/getPdf");
const sendMail = require("./utils/sendMail");

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

const user = {
	id: "65c62cc56d946390235dabf6346",
	Name: "Wasif_Alam",
	Age: 26,
	Email: "wsfalam55@gmail.com",
};

const execute = async (fileId, folderId) => {
	try {
		// Only work if the saved docx is an actual google-docx (not ms word)
		// const docx = await exportFile(
		// 	drive,
		// 	fileId,
		// 	"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		// );
		// console.log("👻", docx);

		const docx = await getDocxFromDrive(drive, fileId);
		console.log("👻", docx);

		const docxBuf = await renderDocx(docx, user);
		console.log("🧐", docxBuf);

		const uploadRes = await uploadFileToDrive(
			drive,
			folderId,
			docxBuf,
			`${user.Name}-${user.id}-1`,
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		);
		console.log("🛑", uploadRes.data.id);
		const docxFileId = uploadRes.data.id;

		await drive.permissions.create({
			auth: oAuth2Client,
			fileId: docxFileId,
			requestBody: {
				role: "reader",
				type: "anyone",
			},
		});

		const pdfBuf = await getPdf(docxFileId);
		await sendMail(pdfBuf);
	} catch (error) {
		console.error("Error:", error);
		// Handle errors here
	}
};

const command = process.argv[2];

if (command === "--exec") {
	execute(
		"1nWlbivYIMNbbche7EfYaeyl0TAn4BDQj",
		"1nkvpUk2or3px_1Wg3niqG-c341JRnsfe"
	);
}
