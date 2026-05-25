import nodemailer from 'nodemailer';

const createTransporter = () => {
  const port = parseInt(process.env.SMTP_PORT, 10) || 465;
  const secure = port === 465; // true only for port 465, false for 587
  
  // Strip surrounding quotes if present (common .env mistake)
  const pass = (process.env.SMTP_PASS || '').replace(/^"|"$/g, '');

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass,
    },
    tls: {
      rejectUnauthorized: false, // Helps with some local SSL issues
    },
  });
};

export const sendOtpEmail = async (to, otp, type = 'registration') => {
  try {
    const transporter = createTransporter();
    
    let subject, html;
    
    if (type === 'registration') {
      subject = 'BidNest - Verify Your Email';
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f8f63;">Welcome to BidNest!</h2>
          <p>Please use the following OTP to verify your email address and complete your registration:</p>
          <div style="background-color: #f4efe5; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #10213a; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This OTP will expire in ${process.env.EMAIL_OTP_EXPIRY_MINUTES || 10} minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `;
    } else if (type === 'forgotPassword') {
      subject = 'BidNest - Reset Your Password';
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f8f63;">Password Reset Request</h2>
          <p>You have requested to reset your password. Use the following OTP to proceed:</p>
          <div style="background-color: #f4efe5; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #10213a; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This OTP will expire in ${process.env.EMAIL_OTP_EXPIRY_MINUTES || 10} minutes.</p>
          <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        </div>
      `;
    }

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email: ', error);
    return false;
  }
};
