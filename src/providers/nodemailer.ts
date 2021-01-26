const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');


let transporter = nodemailer.createTransport(smtpTransport({
     service: 'gmail',
     host: 'smtp.gmail.com',
     auth: {
         user: process.env.MAIL_FROM_EMAIL,
         pass: process.env.MAIL_FROM_PASS,
     }
}));

export default transporter;