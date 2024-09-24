import nodemailer from 'nodemailer';
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
  const sendConfirmationEmail = (email, serviceName, planName, status) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Service ${status.charAt(0).toUpperCase() + status.slice(1)} Confirmation`, // Dynamic subject based on status
    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Service ${status.charAt(0).toUpperCase() + status.slice(1)} Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f8f8f8;">
  <!-- Full Email Container -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; border-radius: 5px; overflow: hidden;">
    
    <!-- Header Section -->
    <tr>
      <td style="padding: 0; background-image: url('https://img.myloview.com/stickers/sps-letter-original-monogram-logo-design-700-213913855.jpg'); background-size: cover; background-position: center; height: 300px;">
        <div style="text-align: center; padding: 80px 20px; color: white;">
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; background-color: #ffffff;">
        <h3 style="color: #4a4a4a; margin-bottom: 20px;">Service ${status.charAt(0).toUpperCase() + status.slice(1)} Confirmation</h3>
        <p>Dear Customer,</p>
        <p>Your service <strong style="color: #007bff;">${serviceName}</strong> has been successfully <strong >${status}</strong> under the plan <strong style="color: #007bff;">${planName}</strong>.</p>
        <p><strong>Service ${status.charAt(0).toUpperCase() + status.slice(1)} Date:</strong> ${createdDate}</p>
        <p>Thank you for choosing Future Telecom Service Ltd!</p>
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        <p>Best regards,<br>TelCo Service Ltd</p>
      </td>
    </tr>
    <td style="padding: 20px; background-color: #f8f8f8; text-align: center; font-size: 14px; color: #777;">
        <p style="margin-bottom: 10px;">This message was sent to ${email}</p>
        <p style="margin-bottom: 0;">
          <a href="https://your-privacy-policy-link.com" style="color: #007bff; text-decoration: none;">Privacy Policy</a> | 
          <a href="https://your-manage-settings-link.com" style="color: #007bff; text-decoration: none;">Manage Settings</a> | 
          <a href="https://your-unsubscribe-link.com" style="color: #007bff; text-decoration: none;">Unsubscribe</a>
        </p>
      </td>
    </tr>


    <!-- Footer Section -->
    <tr>
      <td style="background-color: #007bff; color: white; text-align: center; padding: 10px; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;">
        <p style="margin: 0;">&copy; 2024 Future Telecom Service Ltd. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
    `   
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        reject(error);
      } else {
        console.log('Email sent: ' + info.response);
        resolve(info.response);
      }
    });
  });
};

export default sendConfirmationEmail;