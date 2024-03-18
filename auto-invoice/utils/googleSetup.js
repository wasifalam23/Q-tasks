const { google } = require("googleapis");

const gSetup = function () {
	const credentials = {
		type: process.env.TYPE,
		project_id: process.env.PROJECT_ID,
		private_key_id: process.env.PRIVATE_KEY_ID,
		private_key: process.env.PRIVATE_KEY,
		client_email: process.env.CLIENT_EMAIL,
		client_id: process.env.CLIENT_ID,
		auth_uri: process.env.AUTH_URI,
		token_uri: process.env.TOKEN_URI,
		auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URL,
		client_x509_cert_url: process.env.CLIENT_CERT_URL,
		universe_domain: process.env.UNIVERSE_DOMAIN,
	};

	try {
		const scopes = [
			"https://www.googleapis.com/auth/drive",
			"https://www.googleapis.com/auth/docs",
		];

		const auth = new google.auth.GoogleAuth({
			credentials,
			scopes,
		});

		const drive = google.drive({
			version: "v3",
			auth,
		});

		console.log("Google OAuth2 client setup complete ✔️");

		return {
			drive,
			auth,
		};
	} catch (error) {
		throw error;
	}
};

module.exports = gSetup;
