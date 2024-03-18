const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

const uploadToS3 = async (fileBuffer, fileName) => {
	// Set up AWS credentials
	const s3Client = new S3Client({
		region: process.env.S3_REGION,
		credentials: {
			accessKeyId: process.env.S3_ACCESS_KEY,
			secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
		},
	});

	// Define parameters for uploading PDF buffer to S3
	const params = {
		Bucket: process.env.S3_BUCKET_NAME,
		Key: fileName,
		Body: fileBuffer,
		ContentType: "application/pdf",
	};

	// Upload PDF buffer to S3 using Upload class
	try {
		const upload = new Upload({
			client: s3Client,
			params: params,
		});

		const result = await upload.done();

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

		return customValues;
	} catch (err) {
		throw err;
	}
};

module.exports = uploadToS3;
