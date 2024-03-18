const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const gSetup = require("./utils/googleSetup");
const docxToPdf = require("./utils/docxToPdf");

const {
	getFileFromDrive,
	uploadFileToDrive,
	getDrivePermisssion,
	deleteFileFromDrive,
} = require("./utils/drive");

const setup = async () => {
	try {
		const { drive, serviceAuth } = gSetup();

		const docxBuf = await getFileFromDrive(drive, process.env.DRIVE_INVOICE_ID);

		console.log(docxBuf);
	} catch (err) {
		console.log("🔥", err);
	}
};

setup();
