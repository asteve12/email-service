// Load dependencies
const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Email template generator
const createEmailTemplate = (data) => {
  return `
   <!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New Project Inquiry - Web3 Ambassadors</title>
</head>

<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6;background-color: #F1F2F4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;background-color: white;">
        <!-- Header -->
        <tr>
            <td style="padding: 25px 20px; text-align: center;">
                <h2>Web3 Ambassadors</h2>
            </td>
        </tr>

        <!-- Main Content -->
        <tr>
            <td style="padding: 30px 25px;">
                <h2 style="color: #2d3436; margin: 0 0 20px;">New Project Inquiry! 🚀</h2>

                <!-- Client Message -->
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                    <p style="margin: 0; color: #495057; font-style: italic;">
                        ${data.message}
                    </p>
                </div>

                <!-- Project Details -->
                <table width="100%" cellpadding="10">
                    <tr>
                        <td width="30%" style="color: #6c757d;">Project Name:</td>
                        <td style="color: #2d3436; font-weight: 500;">${data.message}</td>
                    </tr>
                    <tr>
                        <td style="color: #6c757d;">Job Description:</td>
                        <td style="color: #2d3436;">
                            <p style="margin: 0;">${data.project_name}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="color: #6c757d;">Project Links:</td>
                        <td>
                            <p style="margin: 0 0 10px;">
                                <a href=${data.project_website} style="color: #007bff; text-decoration: none;"
                                    target="_blank">🌐 Project Website</a>
                            </p>
                            <p style="margin: 0;">
                                <a href=${data.X_link}
                                    style="color: #007bff; text-decoration: none;" target="_blank">🐦 Project
                                    Twitter</a>
                            </p>
                        </td>
                    </tr>
                </table>

             
                
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="padding: 25px 20px; background-color: #f8f9fa; text-align: center;">
                <p style="color: #6c757d; margin: 0 0 15px; font-size: 0.9em;">
                    This message was sent through Web3 Ambassadors<br>
                    
                </p>
                <p style="color: #6c757d; margin: 0; font-size: 0.9em;">
                    © 20235 Web3 Ambassadors. All rights reserved.
                </p>
            </td>
        </tr>
    </table>
</body>

</html>
  `;
};

// Email sending endpoint
app.post('/send-email', async (req, res) => {
  try {
    const { to, message,job_description,project_name,project_website,X_link} = req.body;
    const mailOptions = {
      from: `Web3 Ambassadors   <${process.env.EMAIL_USER}>`,
      to,
      subject:`Ambassador gig notification`,
      text: job_description,
      html: createEmailTemplate({ message,job_description,project_name,project_website,X_link })
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Email sending failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
