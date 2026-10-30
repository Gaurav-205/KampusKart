const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const PROD_BACKEND_URL = 'https://s72-gaurav-capstone.onrender.com';

// Determine the callback URL based on environment
const getCallbackURL = () => {
  if (process.env.BACKEND_URL) {
    return `${process.env.BACKEND_URL}/api/auth/google/callback`;
  }
  if (process.env.NODE_ENV === 'production') {
    return `${PROD_BACKEND_URL}/api/auth/google/callback`;
  }
  return 'http://localhost:5000/api/auth/google/callback';
};

// Google sign-in is opt-in: it runs only when GOOGLE_AUTH_ENABLED=true and the client credentials
// are set. Otherwise the server still boots and email/password auth keeps working.
const isGoogleAuthConfigured =
  process.env.GOOGLE_AUTH_ENABLED === 'true' &&
  Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

if (isGoogleAuthConfigured) {
  console.log('Google OAuth Callback URL:', getCallbackURL());
} else if (process.env.NODE_ENV !== 'test') {
  console.warn('Google sign-in is disabled (set GOOGLE_AUTH_ENABLED=true with GOOGLE_CLIENT_ID/SECRET to enable).');
}

if (isGoogleAuthConfigured) passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: getCallbackURL(),
      proxy: true // Add this to handle proxy settings
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if profile has emails
        if (!profile.emails || profile.emails.length === 0) {
          return done(new Error('No email found in Google profile'), null);
        }
        
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Check if user exists with the same email
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // Only link to an existing account when Google vouches for the address; otherwise
            // an unverified Google email could take over someone else's password account.
            if (profile.emails[0].verified === false) {
              return done(new Error('Google email is not verified'), null);
            }
            // Link Google account to existing user
            user.googleId = profile.id;
            await user.save();
          } else {
            // Create new user
            user = await User.create({
              googleId: profile.id,
              email: profile.emails[0].value,
              name: profile.displayName,
            });
          }
        }

        return done(null, user);
      } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
module.exports.isGoogleAuthConfigured = isGoogleAuthConfigured; 