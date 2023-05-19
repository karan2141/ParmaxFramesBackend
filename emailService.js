import nodemailer from 'nodemailer'
import { MAIL_EMAIL, MAIL_PASSWORD } from './constants.js';

const MAIL_SETTINGS = {
  service: 'gmail',
  auth: {
    user: MAIL_EMAIL,
    pass: MAIL_PASSWORD,
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
              <img style="height: 48px; margin-bottom: 5px" src="https://parmaxframes.vercel.app/static/media/logo.a6d129c215cd619a81d9.png" />
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

export const sendOrderMail = (params) => {
  try {
    transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: params.to, 
      subject: 'Order Recieved',
      html: `
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="https://parmaxframes.vercel.app/">
              <img style="height: 48px; margin-bottom: 5px" src="https://parmaxframes.vercel.app/static/media/logo.a6d129c215cd619a81d9.png" />
            </a>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>Thank you for choosing Parmax Frames. we have successfully recieved you order ${params.orderId}</p>
          <p style="font-size:0.9em;">Regards,<br />Parmax Frames</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Parmax Frames</p>
            <p>1600 Amphitheatre Parkway</p>
            <p>California</p>
          </div>
        </div>
      </div>
    `,
    });
  } catch (error) {
    console.log("error in email send to customer--->>>>", error);
    return false;
  }
};

export const sendOrderMailToOwner = (params) => {
  try {
    transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: MAIL_SETTINGS.auth.user, 
      subject: `New Order Recieved ${params.orderId}`,
      html: `
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="https://parmaxframes.vercel.app/">
              <img style="height: 48px; margin-bottom: 5px" src="https://parmaxframes.vercel.app/static/media/logo.a6d129c215cd619a81d9.png" />
            </a>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>We have recieved a new order ${params.orderId}</p>
          <p>Name: ${params.name}</p>
          <p>Email: ${params.email}</p>
          <p>Phone No. ${params.phone}</p>
          <p>Address: ${params.address}</p>
          <p>PFA images attached below.</p>
          <p style="font-size:0.9em;">Regards,<br />Parmax Frames</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Parmax Frames</p>
            <p>1600 Amphitheatre Parkway</p>
            <p>California</p>
          </div>
        </div>
      </div>
    `,
    attachments: params.attachments
    });
  } catch (error) {
    console.log('error in email send to owner--->>>>', error);
    return false;
  }
};

export default sendMail