const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      this.setupTransporter();
      this.isConfigured = true;
      console.log('📧 Email service configured successfully!');
    } else {
      console.log('⚠️  Email service not configured. OTPs will only be logged to console.');
      console.log('📧 To enable email sending, configure EMAIL_USER and EMAIL_PASS in your .env file');
      console.log('📖 See EMAIL_SETUP.md for detailed instructions');
      this.isConfigured = false;
    }
  }

  setupTransporter() {
    const emailService = process.env.EMAIL_SERVICE || 'gmail';
    
    switch (emailService.toLowerCase()) {
      case 'gmail':
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
        break;
        
      case 'outlook':
        this.transporter = nodemailer.createTransport({
          host: 'smtp-mail.outlook.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          },
          tls: {
            ciphers: 'SSLv3'
          }
        });
        break;
        
      case 'yahoo':
        this.transporter = nodemailer.createTransport({
          service: 'yahoo',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
        break;
        
      case 'ethereal':
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          auth: {
            user: 'ethereal.user@ethereal.email',
            pass: 'verysecret'
          }
        });
        break;
        
      case 'mailtrap':
        this.transporter = nodemailer.createTransport({
          host: 'sandbox.smtp.mailtrap.io',
          port: 2525,
          auth: {
            user: process.env.MAILTRAP_USER || 'your-mailtrap-user',
            pass: process.env.MAILTRAP_PASS || 'your-mailtrap-pass'
          }
        });
        break;
        
      default:
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
    }
  }

  async sendOTPEmail(email, otp) {
    try {
      if (!this.isConfigured) {
        console.log('📧 Email not configured - OTP logged to console only');
        console.log(`🔐 OTP for ${email}: ${otp}`);
        return { success: true, message: 'OTP logged to console (email not configured)' };
      }

      const mailOptions = {
        from: {
          name: 'Fashion Forward',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Password Reset OTP - Fashion Forward',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #8B5CF6, #EC4899); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Fashion Forward</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your Fashion Destination</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #374151; margin: 0 0 20px 0;">Password Reset Request</h2>
              
              <p style="color: #6B7280; line-height: 1.6; margin-bottom: 20px;">
                We received a request to reset your password. Use the OTP below to verify your identity and reset your password.
              </p>
              
              <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 14px;">Your OTP Code</p>
                <div style="font-size: 32px; font-weight: bold; color: #8B5CF6; letter-spacing: 5px; font-family: monospace;">${otp}</div>
              </div>
              
              <div style="background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #92400E; font-size: 14px;">
                  <strong>Important:</strong> This OTP will expire in 10 minutes. Do not share this code with anyone.
                </p>
              </div>
              
              <p style="color: #6B7280; line-height: 1.6; margin-bottom: 20px;">
                If you didn't request this password reset, please ignore this email. Your account remains secure.
              </p>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                  This email was sent from Fashion Forward. Please do not reply to this email.
                </p>
              </div>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('OTP Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new Error('Failed to send OTP email');
    }
  }

  async sendWelcomeEmail(email, firstName) {
    try {
      if (!this.isConfigured) {
        console.log(`📧 Welcome email not sent (email not configured) for ${email}`);
        return { success: true, message: 'Welcome email not sent (email not configured)' };
      }

      const mailOptions = {
        from: {
          name: 'Fashion Forward',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Welcome to Fashion Forward!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #8B5CF6, #EC4899); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Fashion Forward!</h1>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #374151; margin: 0 0 20px 0;">Hello ${firstName}!</h2>
              
              <p style="color: #6B7280; line-height: 1.6; margin-bottom: 20px;">
                Welcome to Fashion Forward! We're excited to have you join our fashion community. 
                You now have access to our latest collections, exclusive deals, and personalized recommendations.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
                   style="background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Start Shopping Now
                </a>
              </div>
              
              <p style="color: #6B7280; line-height: 1.6; margin-bottom: 20px;">
                Thank you for choosing Fashion Forward. We look forward to helping you discover your perfect style!
              </p>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
  }

  async sendOrderConfirmationEmail(email, orderDetails) {
    try {
      if (!this.isConfigured) {
        console.log(`📧 Order confirmation email not sent (email not configured) for ${email}`);
        return { success: true, message: 'Order confirmation email not sent (email not configured)' };
      }

      const mailOptions = {
        from: {
          name: 'Fashion Forward',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: `Order Confirmation #${orderDetails.orderNumber} - Fashion Forward`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #8B5CF6, #EC4899); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed!</h1>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #374151; margin: 0 0 20px 0;">Order #${orderDetails.orderNumber}</h2>
              
              <p style="color: #6B7280; line-height: 1.6; margin-bottom: 20px;">
                Thank you for your order! We've received your order and will process it shortly.
              </p>
              
              <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; margin: 0 0 15px 0;">Order Summary</h3>
                <p style="margin: 5px 0; color: #6B7280;"><strong>Total Amount:</strong> ₹${orderDetails.total}</p>
                <p style="margin: 5px 0; color: #6B7280;"><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</p>
                <p style="margin: 5px 0; color: #6B7280;"><strong>Delivery Address:</strong> ${orderDetails.deliveryAddress}</p>
              </div>
              
              <p style="color: #6B7280; line-height: 1.6; margin-bottom: 20px;">
                You'll receive another email with tracking information once your order ships.
              </p>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Order confirmation email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      throw new Error('Failed to send order confirmation email');
    }
  }
}

module.exports = new EmailService();