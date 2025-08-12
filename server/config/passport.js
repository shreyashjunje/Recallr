const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User"); // Your mongoose user model

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //   callbackURL: "/auth/google/callback",
      callbackURL: "http://localhost:3000/api/auth/google/callback"

    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // If email exists for a manual signup, link Google account
          const existingEmailUser = await User.findOne({ email: profile.emails[0].value });
          if (existingEmailUser) {
            existingEmailUser.googleId = profile.id;
            existingEmailUser.avatar = profile.photos[0].value;
            await existingEmailUser.save();
            return done(null, existingEmailUser);
          }

          // Otherwise create a new Google user
          user = await User.create({
            googleId: profile.id,
            userName: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
          });
        }

        done(null, user);
        
      } catch (err) {
        done(err, null);
      }
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
