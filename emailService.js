import nodemailer from 'nodemailer'
import { MAIL_EMAIL, MAIL_PASSWORD, FE_URL } from './constants.js';

const MAIL_SETTINGS = {
  service: 'gmail',
  auth: {
    user: MAIL_EMAIL,
    pass: MAIL_PASSWORD,
  },
}
const transporter = nodemailer.createTransport(MAIL_SETTINGS);

const sendMail = async(params) => {
  try {
    await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: params.to, 
      subject: 'Parmax Frames Verify OTP',
      html: `
      <div style="font-family: Helvetica,Arial,sans-serif;max-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="${FE_URL}/">
              <img style="height: 48px; margin-bottom: 5px" src="${FE_URL}/images/logo.jpg" />
            </a>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>Thank you for choosing Parmax Frames. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
          <h2 style="background: #FF5E14;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${params.OTP}</h2>
          <p style="font-size:0.9em;">Regards,<br />Parmax Frames</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Parmax Frames</p>
            // <p>1600 Amphitheatre Parkway</p>
            // <p>California</p>
          </div>
        </div>
      </div>
    `,
    });
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
        <div class="card" style="max-width: 1000px; font-family: Helvetica,Arial,sans-serif;line-height:2">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <img src="${FE_URL}/images/logo.jpg" alt="logo" style="height: 30px;">
            <div style="text-align: end;">
              <h1 style="color: rgb(255, 94, 20); font-size: 20px; margin: 2px 0px;">Order Confirmation</h1>
              <p style="margin: 0px;">Order id: ${params.orderId}</p>
            </div>
        </div>
        <hr>
        <h1 style="text-align: start; color: rgb(255, 94, 20); font-size: 20px; margin: 2px 0px;">Hello ${params.name},</h1>
        <div style="text-align: left;">Thank you for you order. Your estimated delivery date is indicated below. If you would link to view the status of your order, please visit <a href="${FE_URL}/my-orders">My Orders</a> on <a href="${FE_URL}">parmaxframes.com</a></div>
        <div style="background: rgb(217, 217, 217); padding: 10px; display: flex; border-top: 2px solid black; margin-top: 5px;">
            <div style="text-align: left; width: 50%;">
              <div style="font-weight: 600;">Ariving:</div>
              <div>In 5 - 7 days</div>
            </div>
            <div style="text-align: left; width: 50%;">
              <div style="font-weight: 600;">Your order will be sent to:</div>
              <div>${params.name}</div>
              <div>${params.address}</div>
              <div>${params.country}</div>
            </div>
        </div>
        <h1 style="text-align: start; color: rgb(255, 94, 20); font-size: 20px; margin: 2px 0px;">Order Summary</h1>
        <hr>
        <div style="display: flex; justify-content: space-between;">
            <div>Price per Frame: </div>
            <div>₹${params.pricePerFrame}</div>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <div>No. of Frames: </div>
            <div>${params.noOfFrames}</div>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <div>Price: </div>
            <div>₹${params.price + params.discount}</div>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <div>Discount: </div>
            <div>₹${params.discount}</div>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <div>Shipping: </div>
            <div>Free</div>
        </div>
        <hr>
        <div style="display: flex; justify-content: space-between; font-weight: 600;">
            <div>Total: </div>
            <div>₹${params.price}</div>
        </div>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
          <p>Parmax Frames</p>
          <p>parmax frames address</p>
          <p>Chandigarh</p>
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
      <div style="font-family: Helvetica,Arial,sans-serif;max-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="${FE_URL}">
              <img style="height: 48px; margin-bottom: 5px" src="${FE_URL}/images/logo.jpg" />
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

export const sendContactUsEmail = async(params) => {
  try {
    await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: MAIL_SETTINGS.auth.user,
      subject: `${params.subject}`,
      html: `
      <div style="font-family: Helvetica,Arial,sans-serif;max-width:1000px;overflow:auto;line-height:2">
        <p style="font-size:1.1em">From: ${params.fullName}</p>
        <p style="font-size:1.1em">Email Id: ${params.email}</p>
        <p>Message: ${params.message}</p>
      </div>
    `,
    attachments: params.attachments
    });
  } catch (error) {
    console.log('error in contact us email send --->>>>', error);
    return false;
  }
};

export default sendMail