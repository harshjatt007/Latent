const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config(); // To access the environment variables (Client ID and Secret)

// Configure the Google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === "production"
      ? "https://latent-kk5m.onrender.com/auth/google/callback"
      : "http://localhost:5000/auth/google/callback" // The redirect URI
  },
  (accessToken, refreshToken, profile, done) => {
    // Here, you will have the user's profile (including email, name, etc.)
    // You can save it to your database or simply pass it through
    console.log('Google profile:', profile);
    
    // Done is called when the strategy finishes, passing the user profile
    return done(null, profile);
  }
));

// Serialize user information into the session (stored in a cookie)
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize the user information from the session (cookie)
passport.deserializeUser((user, done) => {
    done(null, user);
});
