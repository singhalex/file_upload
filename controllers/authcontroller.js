const bcrypt = require("bcryptjs");
const asyncHandeler = require("express-async-handler");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.login_post = asyncHandeler(async (req, res, next) => {
  // TODO
  res.send("You have logged in");
});

exports.signup_post = asyncHandeler(async (req, res, next) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    if (err) return next(err);

    try {
      const user = await prisma.user.create({
        data: {
          username: username,
          password: hashedPassword,
        },
      });
      res.send(`Hello ${user.username}. Your password is ${user.password}`);
    } catch (err) {
      console.log(err);
      res.redirect("/");
    }
  });
});
