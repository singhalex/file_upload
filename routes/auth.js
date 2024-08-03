const express = require("express");
const router = express.Router();

const authController = require("../controllers/authcontroller");

// Authenticate user on POST
router.post("/log-in", authController.login_post);

// Show log in form on GET
router.get("/sign-up", authController.signup_get);

// Create user on POST
router.post("/sign-up", authController.signup_post);

// Log user out on GET
router.get("/log-out", authController.logout_get);

module.exports = router;
