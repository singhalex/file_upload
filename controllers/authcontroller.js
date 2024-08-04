const bcrypt = require("bcryptjs");
const asyncHandeler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("../utils/passport");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Render page with log in form on GET
exports.signup_get = (req, res, next) => {
  res.render("index", { signUp: true });
};

// Log in the user on POST
exports.login_post = [
  // Authenticate the user
  body().custom(async (value, { req }) => {
    const user = await prisma.user.findUnique({
      where: {
        username: value.username,
      },
    });
    // Cannot find user in db
    if (!user) {
      throw new Error("Username does not exist.");
    }
    // Provided password does not match
    const match = await bcrypt.compare(value.password, user.password);
    if (!match) {
      throw new Error("Incorrect password");
    }

    // Save the retrieved user to the req object
    req.authedUser = { id: user.id, username: user.username };
  }),

  // Render page again if errors exist
  (req, res, next) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      return res.render("index", { errors });
    }
    next();
  },

  // Create a session using the passport local strategy
  passport.authenticate("local", {
    successRedirect: "/",
  }),
];

// Create user on POST
exports.signup_post = [
  // Validation and sanitation
  body("username")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Username cannot be empty."),
  body("username").custom(async (value) => {
    const user = await prisma.user.findUnique({
      where: {
        username: value,
      },
    });
    if (user) {
      throw new Error("Username already exists");
    }
  }),
  body("password")
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters long."),
  body("confirm")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords do not match"),

  // Create User
  asyncHandeler(async (req, res, next) => {
    const { username, password } = req.body;

    // Re-render page if errors exist
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      res.render("index", { errors, usernameValue: username, signUp: true });
      return;
    }

    // Save user to DB with hashed password
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) return next(err);

      try {
        const user = await prisma.user.create({
          data: {
            username: username,
            password: hashedPassword,
          },
        });

        // Set the user infor to be logged in in the next step
        req.authedUser = {
          id: user.id,
          username: user.username,
        };
        next();
      } catch (err) {
        next(err);
      }
    });
  }),

  // Create a session using the passport local strategy
  passport.authenticate("local", {
    successRedirect: "/",
  }),
];

// Remove user from session on GET
exports.logout_get = (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);

    res.redirect("/");
  });
};
