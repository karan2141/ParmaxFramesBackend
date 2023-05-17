import { ENCRYPTION } from "../constants.js";
import { decryptData } from "../utils.js"


const DecryptRequest = async(req, res, next) => {
    if(ENCRYPTION==='Y' && !!req.body.payload) {
        const decryptedData = decryptData(req.body.payload)
        req.body = decryptedData
    }
    next()
}

export default DecryptRequest