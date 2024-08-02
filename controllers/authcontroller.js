const bcrypt = require("bcryptjs");
const asyncHandeler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.login_post = asyncHandeler(async (req, res, next) => {
  // TODO
  res.send("You have logged in");
});

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
      res.render("index", { errors, usernameValue: username });
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
        // TODO
        res.send(`Hello ${user.username}. Your password is ${user.password}`);
      } catch (err) {
        next(err);
      }
    });
  }),
];
