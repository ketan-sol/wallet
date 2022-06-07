import nodemailer from 'nodemailer';
import config from '../config/config.js';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: config.MAIL_ADDRESS,
    pass: config.MAIL_PASSWORD,
  },
});

const sendOtp = (OTP, email) => {
  transporter.sendMail({
    to: email,
    from: config.MAIL_ADDRESS,
    subject: 'Confirm Mail',
    text: OTP,
  });
};

export default sendOtp;
