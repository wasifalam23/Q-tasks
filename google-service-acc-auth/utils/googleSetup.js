const { google } = require("googleapis");
const path = require("path");

const gSetup = function () {
	try {
		const scopes = [
			"https://www.googleapis.com/auth/drive",
			"https://www.googleapis.com/auth/docs",
		];

		const keyFile = path.join(__dirname, "../credentials.json");

		console.log(keyFile);

		const serviceAuth = new google.auth.GoogleAuth({
			keyFile,
			scopes,
		});

		const drive = google.drive({
			version: "v3",
			auth: serviceAuth,
		});

		console.log("Google OAuth2 client setup complete ✔️");

		return {
			drive,
			serviceAuth,
		};
	} catch (error) {
		throw error;
	}
};

module.exports = gSetup;
