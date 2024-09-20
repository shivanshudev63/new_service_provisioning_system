import nodemailer from "nodemailer";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
const createdDate = new Date().toLocaleDateString();
// Function to send an email with OTP
const transporter = nodemailer.createTransport({
  
    service: 'gmail', // You can use other services like 'SendGrid', 'Outlook', etc.
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Your App Password
    },
    debug:true,
    logger: true,
  });
  transporter.verify(function(error, success) {
    if (error) {
      console.log("Transporter verification error:", error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
  const sendConfirmationEmail = (email, serviceName, planName) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Service Enrollment Confirmation',
      text: `Dear Customer,

      Your service ${serviceName} has been successfully activated under the plan ${planName}.
      
      Service Activation Date: ${createdDate}
      
      Thank you for choosing us!
      
      Best regards,
      The Future Telecom`    
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  };
export default sendConfirmationEmail;