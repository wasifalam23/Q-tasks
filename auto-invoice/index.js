const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const moment = require("moment");
const dbInit = require("./utils/dbInit");
const generateRandomAlphaNumeric = require("./utils/getRandomId");
const {
	getFileFromDrive,
	uploadFileToDrive,
	getDrivePermisssion,
	deleteFileFromDrive,
} = require("./utils/drive");
const parseDocx = require("./utils/docxParser");
const gSetup = require("./utils/googleSetup");
const docxToPdf = require("./utils/docxToPdf");
const uploadToS3 = require("./utils/uploadToS3");

const setup = async () => {
	const { db, currentUser } = await dbInit();
	const { drive, auth } = gSetup();

	const supCol = db.collection("suppliers");
	const invCol = db.collection("invoices");
	const compCol = db.collection("companies");

	const supData = await supCol.find({ default_invoice: true });
	const compData = await compCol.find();
	const compFirstData = compData[0];

	supData.forEach(async (supplier) => {
		try {
			const formattedDate = moment().format("DD-MM-YYYY");

			const randomId = `${generateRandomAlphaNumeric(8)}-${Date.now()}`;
			const invoice_id = `${supplier.supplier_name
				.split(" ")
				.join("_")}-${randomId}`;

			const invParseData = {
				...supplier,
				...compFirstData,
				description: "from node script",
				total_currency: supplier.monthly,
				sales: 0,
				shipping_and_handling: 0,
				invoice_date: formattedDate,
				invoice_id: randomId,
			};

			// Get Template Docx from drive
			const docxTempBuf = await getFileFromDrive(
				drive,
				process.env.DRIVE_INVOICE_ID
			);

			// Render and maipulate DOCX files
			const docxBuf = parseDocx(docxTempBuf, invParseData);

			// Upload docx files to drive
			const docxId = await uploadFileToDrive(
				drive,
				process.env.DRIVE_UPLOAD_FOLDER_ID,
				docxBuf,
				`${invoice_id}.docx`,
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
			);

			// Give permission to drive to use axios for pdf conversion
			await getDrivePermisssion(drive, auth, docxId);

			// Get Pdf as Buffer from docx using axios
			const pdfBuf = await docxToPdf(docxId);

			// Delete the docx file from drive
			await deleteFileFromDrive(drive, docxId);

			// Upload to s3 and get custom response back
			const s3Response = await uploadToS3(pdfBuf, `${invoice_id}.pdf`);
			const currentDate = new Date();

			const invoiceData = {
				supplier: supplier._id,
				company: compFirstData._id,
				description: invParseData.description,
				total_currency: invParseData.total_currency,
				sales: invParseData.sales,
				shipping_and_handling: invParseData.shipping_and_handling,
				invoice_date: currentDate,
				created_at: currentDate,
				created_by: currentUser.id,
				image_url: "",
				invoice_id: randomId,
				documents: [s3Response],
			};

			// insert the invoice with documents on db
			const response = await invCol.insertOne(invoiceData);

			console.log("🖍️ ", response);
		} catch (err) {
			console.log("🔥", err);
		}
	});
};

setup();
