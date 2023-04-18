require('dotenv').config({ path: './config.env' });
const AWS = require('aws-sdk'),
  { SNS } = require('@aws-sdk/client-sns');

AWS.config.update({ region: 'us-east-1' });

exports.publishMessage = async (event) => {
  console.log(event);
  try {
    const params = {
      Message: 'Hi, this is a test message from aws sns',
      TopicArn: process.env.Topic_Arn,
    };

    const publishTextPromise = new SNS().publish(params);

    await publishTextPromise;

    return {
      statusCode: 200,
      body: JSON.stringify(`📃 Message: ${params.Message} is being published`),
    };
  } catch (err) {
    console.log(err, err.stack);
  }
};
