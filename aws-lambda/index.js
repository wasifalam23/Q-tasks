const { parser } = require('./parser');

exports.handler = async (event) => {
  const employers = await parser();

  const response = {
    statusCode: 200,
    body: JSON.stringify(employers),
  };
  return response;
};
