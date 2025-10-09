# Email Configuration Setup Guide

To enable email functionality for OTP sending, you need to configure your email settings in the Backend/.env file.

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Add to your .env file**:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
FRONTEND_URL=http://localhost:5173
```

## Alternative Email Services

You can also use other email services by modifying the emailService.js configuration:

### Outlook/Hotmail
```javascript
this.transporter = nodemailer.createTransporter({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

### Custom SMTP
```javascript
this.transporter = nodemailer.createTransporter({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

## Testing

After configuration:
1. Restart your backend server
2. Try the forgot password functionality
3. Check your email inbox (and spam folder)
4. The OTP will also be logged to the console for testing

## Security Notes

- Never commit your .env file to version control
- Use app passwords, not your main account password
- Consider using environment-specific email accounts for production



