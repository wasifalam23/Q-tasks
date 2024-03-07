const fs = require("fs").promises;
const { Readable } = require("stream");
const path = require("path");

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

// Set up AWS credentials
const s3Client = new S3Client({
	region: "ap-south-1", // e.g., 'us-east-1'
	credentials: {
		accessKeyId: "<ACCESS_ID_FROM_IAM>",
		secretAccessKey: "<SECRET_ACCESS_KEY_FROM_IAM>",
	},
});

const uploadToS3 = async () => {
	const pdfBuffer = await fs.readFile(path.join(__dirname, "/dummy.pdf"));

	// Define parameters for uploading PDF buffer to S3
	const params = {
		Bucket: "",
		Key: "example.pdf", // Specify the filename
		Body: pdfBuffer, // pdfBuffer is the buffer containing the PDF data
		ContentType: "application/pdf", // Set appropriate content type
	};

	// Upload PDF buffer to S3

	// Upload PDF buffer to S3 using Upload class

	try {
		const upload = new Upload({
			client: s3Client,
			params: params,
		});

		const result = await upload.done();
		console.log("PDF uploaded successfully to S3:");
		console.log("🔥", {
			name: upload.params.Key,
			size: upload.totalBytes,
			type: upload.params.ContentType,
		});

		const customValues = {
			name: upload.params.Key,
			size: upload.totalBytes,
			type: upload.params.ContentType,
			s3: {
				Etag: result.ETag,
				ServerSideEncryption: result.ServerSideEncryption,
				Location: result.Location,
				Key: result.Key,
				Bucket: result.Bucket,
			},
		};

		console.log("🔥", customValues);

		console.log("🫡", result);
		console.log("🫡", upload);
		return result;
	} catch (err) {
		console.error("Error uploading PDF to S3:", err);
		throw err;
	}
};

uploadToS3()
	.then((res) => {})
	.catch((err) => console.log("🔥Error:", err));
