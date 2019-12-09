const secret = require("secret");
const accountSid = secret.twilioAccountSid; // Your Account SID from www.twilio.com/console
const authToken = secret.twilioToken;   // Your Auth Token from www.twilio.com/console

const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

module.exports = client;