import CryptoJS from 'crypto-js'
import { ENCRYPTION, ENCRYPTION_IV, ENCRYPTION_KEY } from './constants.js'

export function generateOTP() {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

export const encryptData = (data) => {
    const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        ENCRYPTION_KEY,
        { iv: ENCRYPTION_IV }
    ).toString();
    return {
        payload: encryptedData
    }
}

export const decryptData = (data) => {
    const decryptedData = CryptoJS.AES.decrypt(
        data,
        ENCRYPTION_KEY,
        { iv: ENCRYPTION_IV }
    ).toString(CryptoJS.enc.Utf8);
    const parsedData = JSON.parse(decryptedData);
    return parsedData
}

export const ResposneHandler = (res) => {
    if(ENCRYPTION!=='Y') return res
    return encryptData(res)
}