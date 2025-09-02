const nodemailer = require('nodemailer');   
const dotenv = require('dotenv');   
dotenv.config();    

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
            });
        
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to,
                subject,
                html: htmlContent
            });
        

            console.log('send email successfully')
  } catch (error) {
    console.error(error.message);
  }

};

const clientUrl = process.env.CLIENT_URL;
const verificationLink = `${clientUrl}/verify-email/${token}`;
const htmlContent = `<a href="${verificationLink}">Verify your email</a>`;
sendEmail(user.email, "Verify your email", htmlContent);

module.exports = sendEmail;


