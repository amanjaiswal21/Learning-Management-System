import nodemailer from 'nodemailer';

const sendEmail = async function(email, subject, message) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'kenyon.wuckert@ethereal.email',
            pass: 'NKjc4KHyGaKEdUnHR4'
        }
    });

    // Send email with defined transport object
    await transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL, // Sender address
        to: email, // Recipient email
        subject: subject,
        html: message // HTML body
    });
};

export default sendEmail;
