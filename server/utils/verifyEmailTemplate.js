const verifyEmailTemplate = ({name, url}) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Verify Your Email</title>
    </head>
    <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f4f4f4;">
      <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <tr>
          <td style="padding:20px; text-align:center; background-color:#007BFF; color:white;">
            <h1 style="margin:0; font-size:24px;">Baskoo</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:30px; color:#333333; text-align:left;">
            <h2 style="margin-top:0;">Hello ${name},</h2>
            <p style="font-size:16px; line-height:1.5;">
              Thank you for registering with <strong>Baskoo</strong>.  
              Please verify your email address by clicking the button below.
            </p>
            <div style="text-align:center; margin:30px 0;">
              <a href="${url}" style="background-color:#007BFF; color:white; padding:14px 24px; text-decoration:none; font-size:16px; border-radius:5px; display:inline-block;">
                Verify Email
              </a>
            </div>
            <p style="font-size:14px; color:#777777;">
              If the button above doesn’t work, copy and paste the following link into your browser:
            </p>
            <p style="word-break:break-all; color:#007BFF; font-size:14px;">
              ${url}
            </p>
          </td>
        </tr>
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

export default verifyEmailTemplate