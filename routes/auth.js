const express = require("express");
const router = express.Router();

router.get("/log-in", (req, res, next) => {
  res.send("Please login");
});

router.post("/log-in", (req, res, next) => {
  res.send("You have logged in");
});

router.get("/sign-up", (req, res, next) => {
  res.send("Please sign up");
});

router.post("sign-up", (req, res, next) => {
  res.send("You have signed up");
});

module.exports = router;
