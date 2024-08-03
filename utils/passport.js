const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Define the local strategy
passport.use(
  new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
      return done(null, req.authedUser);
    }
  )
);

// Save the user id and username into the session
passport.serializeUser((user, done) => {
  done(null, {
    id: user.id,
    username: user.username,
  });
});

// Retrieve the saved user from the session to append to the req object
passport.deserializeUser(async (user, done) => {
  done(null, user);
});

module.exports = passport;
