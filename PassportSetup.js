import passport from "passport"
import passportGoogle from "passport-google-oauth20"
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "./constants.js";

const GoogleStrategy = passportGoogle.Strategy

const PassportSetup = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
      },
      (accessToken, refreshToken, profile, done) => {
        // Verify and retrieve user information
        done(null, profile);
      }
    )
  );
  
  passport.serializeUser((user,done)=>{
      done(null,user)
  })
  
  passport.deserializeUser((user,done)=>{
      done(null,user)
  })
}

export default PassportSetup