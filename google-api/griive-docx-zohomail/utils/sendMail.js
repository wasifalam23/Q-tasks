const nodemailer = require("nodemailer");

const sendMail = async (pdfBuf) => {
	try {
		let transporter = nodemailer.createTransport({
			host: "smtp.zoho.com",
			secure: true,
			port: 465,
			auth: {
				user: "name@zohomail.com",
				pass: "zohoAppPassword",
			},
		});

		const mailOptions = {
			from: "", // sender address
			to: "",
			subject: "Test Subject", // Subject line
			html: "<h1>Test Heading</h1>", // plain text body
			attachments: [
				{
					filename: "template.pdf",
					content: pdfBuf,
				},
			],
		};

		const result = await transporter.sendMail(mailOptions);
		console.log(result);
	} catch (err) {
		throw err;
	}
};

module.exports = sendMail;
