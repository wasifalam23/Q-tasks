const Realm = require("realm-web");

const dbInit = async function () {
	try {
		const app = new Realm.App(process.env.APP_ID);
		const credentials = Realm.Credentials.emailPassword(
			process.env.DB_USER_EMAIL,
			process.env.DB_USER_PASSWORD
		);
		const user = await app.logIn(credentials);
		const currentUser = app.currentUser;
		const mongo = currentUser.mongoClient("mongodb-atlas");
		const db = mongo.db(process.env.DB_NAME);
		console.log("DB Setup Done ✔️");

		return { db, currentUser };
	} catch (error) {
		throw error;
	}
};

module.exports = dbInit;
