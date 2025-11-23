import transporter from "./config.js";

const sendMail = async (email, subject, mail) => {
    const mailSent = await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: subject,
        html: mail,
    });

    return mailSent;
}

export default sendMail;