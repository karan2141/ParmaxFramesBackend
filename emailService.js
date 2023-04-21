import nodemailer from 'nodemailer'

const MAIL_SETTINGS = {
  service: 'gmail',
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASSWORD,
  },
}
const transporter = nodemailer.createTransport(MAIL_SETTINGS);

const sendMail = async (params) => {
  try {
    let info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: params.to, 
      subject: 'Parmax Frames Verify OTP',
      html: `
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="https://parmaxframes.vercel.app/">
              <img style="height: 48px; margin-bottom: 5px" src="data:image/png;base64,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" />
            </a>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>Thank you for choosing Your Brand. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
          <h2 style="background: #FF5E14;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${params.OTP}</h2>
          <p style="font-size:0.9em;">Regards,<br />Your Brand</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Your Brand Inc</p>
            <p>1600 Amphitheatre Parkway</p>
            <p>California</p>
          </div>
        </div>
      </div>
    `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default sendMail