import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_SERVER || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
});

export const sendEmail = async (to, subject, text, html = null) => {
  try {
    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to,
      subject,
      text,
      html: html || text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

export const sendAppointmentConfirmation = async (patientEmail, doctorName, appointmentDate, appointmentTime, clinicAddress) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
        .appointment-details { background: white; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #667eea; }
        .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Appointment Confirmed</h1>
        </div>
        <div class="content">
          <p>Dear Patient,</p>
          <p>Your appointment has been successfully confirmed!</p>
          <div class="appointment-details">
            <h3>Appointment Details:</h3>
            <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
            <p><strong>Date:</strong> ${appointmentDate}</p>
            <p><strong>Time:</strong> ${appointmentTime}</p>
            <p><strong>Location:</strong> ${clinicAddress}</p>
          </div>
          <p>We look forward to seeing you!</p>
          <p>Best regards,<br>ArogyaLink Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(
    patientEmail,
    'Appointment Confirmed - ArogyaLink',
    `Your appointment with Dr. ${doctorName} is confirmed for ${appointmentDate} at ${appointmentTime}. Location: ${clinicAddress}`,
    html
  );
};

export const sendAppointmentReminder = async (patientEmail, doctorName, appointmentDate, appointmentTime) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
        .reminder { background: white; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #f5576c; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Appointment Reminder</h1>
        </div>
        <div class="content">
          <p>Dear Patient,</p>
          <p>This is a reminder that you have an appointment in 1 hour.</p>
          <div class="reminder">
            <h3>Appointment Details:</h3>
            <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
            <p><strong>Date:</strong> ${appointmentDate}</p>
            <p><strong>Time:</strong> ${appointmentTime}</p>
          </div>
          <p>Please make sure to arrive on time!</p>
          <p>Best regards,<br>ArogyaLink Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(
    patientEmail,
    'Appointment Reminder - ArogyaLink',
    `Reminder: You have an appointment with Dr. ${doctorName} in 1 hour (${appointmentDate} at ${appointmentTime})`,
    html
  );
};

