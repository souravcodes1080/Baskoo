const forgotPasswordTemplate = ({ name, otp }) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Reset Your Password</title>
    </head>
    <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f4f4f4;">
      <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <tr>
          <td style="padding:20px; text-align:center; background-color:#007BFF; color:white;">
            <h1 style="margin:0; font-size:24px;">Baskoo</h1>
          </td>
        </tr>
        
        <!-- Content -->
        <tr>
          <td style="padding:30px; color:#333333; text-align:left;">
            <h2 style="margin-top:0;">Hello ${name},</h2>
            <p style="font-size:16px; line-height:1.5;">
              We received a request to reset your password for your <strong>Baskoo</strong> account.
              Use the OTP below to proceed with resetting your password. 
              This OTP is valid for the next <strong>10 minutes</strong>.
            </p>
            
            <!-- OTP Display -->
            <div style="text-align:center; margin:30px 0;">
              <div style="display:inline-block; background-color:#f4f4f4; padding:14px 24px; font-size:22px; font-weight:bold; letter-spacing:4px; border-radius:5px; border:1px solid #ddd; color:#333;">
                ${otp}
              </div>
            </div>

            <p style="font-size:14px; color:#777777;">
              If you didn’t request a password reset, you can safely ignore this email — your account is still secure.
            </p>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background-color:#f4f4f4; padding:15px; text-align:center; font-size:12px; color:#999999;">
            &copy; ${new Date().getFullYear()} Baskoo. All rights reserved.
          </td>
        </tr>

      </table>
    </body>
  </html>
  `;
};

export default forgotPasswordTemplate