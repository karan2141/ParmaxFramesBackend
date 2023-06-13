import Jwt from "jsonwebtoken";
import { JwtSecret } from "../constants.js";
import Admin from "../models/adminModel.js";

const JwtAuthAdmin = async(req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = Jwt.verify(token, JwtSecret);
      const userId = decodedToken.userId;
      const dbUser = await Admin.findById(userId)
      if (!dbUser) {
        throw 'Bad Request';
      } else {
        req.body.userId = userId
        next();
      }
    } catch(e) {
    console.log('error in JWT auth-----', JSON.stringify(e));
    res.status(401).json({
        error: new Error('Invalid request!')
    });
    }
};

export default JwtAuthAdmin