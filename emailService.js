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
              <img style="height: 48px; margin-bottom: 5px" src="https://parmaxframes.vercel.app/static/media/logo.a6d129c215cd619a81d9.webp" />
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