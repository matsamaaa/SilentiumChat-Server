import nodemailer from 'nodemailer';
import Log from '../logs/logs.js';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT || 587,
    secure: process.env.MAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

transporter.verify(function(error, success) {
    if (error) {
        Log.Error("Mail server connection error:", error);
    } else {
        Log.Info("Mail server is ready to take messages");
    }
});

export default transporter;