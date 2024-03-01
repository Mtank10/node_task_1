const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.USER,
      pass: process.env.PASSWORD
    }
  });
module.exports = transporter