const express = require("express");
const router = express.Router();

const authController = require("../controllers/authcontroller");

// Authenticate user on POST
router.post("/log-in", authController.login_post);

// Create user on POST
router.post("/sign-up", authController.signup_post);

module.exports = router;
