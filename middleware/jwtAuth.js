import Jwt from "jsonwebtoken";
import { JwtSecret } from "../constants.js";
import { User } from "../model.js";

const JwtAuthMiddleware = async(req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = Jwt.verify(token, JwtSecret);
      const userId = decodedToken.userId;
      const dbUser = await User.findById(userId)
      if (!dbUser) {
        throw 'Bad Request';
      } else {
        req.body.userId = userId
        next();
      }
    } catch(e) {
    console.log('error-----', JSON.stringify(e));
    res.status(401).json({
        error: new Error('Invalid request!')
    });
    }
};

export default JwtAuthMiddleware