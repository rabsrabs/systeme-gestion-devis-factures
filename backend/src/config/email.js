const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rabia1.ozcelik@gmail.com',
    pass: 'avkbclmgkzvfufvy'
  }
});

module.exports = transporter;
