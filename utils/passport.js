const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Define the local strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Search for the user
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      if (!user) {
        return done(null, false, { msg: "Username does not exist" });
      }

      // Compare hashed passwords
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { msg: "Incorrect password" });
      }

      // Authentication passed, return user
      return done(null, user);
    } catch (err) {
      // An error occured, return the error
      return done(err);
    }
  })
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
