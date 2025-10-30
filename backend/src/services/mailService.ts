import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendOtp(email: string, otp: string) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Код подтверждения',
        html: `<h2>Ваш код: ${otp}</h2>`
    };

    await transporter.sendMail(mailOptions);
}

export default sendOtp;