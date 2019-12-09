const contentful = require("contentful-management");
const secret = require("../secret");

const client = contentful.createClient({
  accessToken: secret.contentfulToken
});

module.exports = client;