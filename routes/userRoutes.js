const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const contentController = require("../controllers/contentController");
const servicesController = require("../controllers/servicesController");

router.post("/createContent", contentController.createContent);
router.get("/contents", contentController.getAllContent);
router.get("/contents/:id", contentController.getContentById);

router.post("/sc", servicesController.createServices);
router.get("/services", servicesController.getAllServices);
router.get("/services/:id", servicesController.getServicesById);

router.post("/register", userController.register);
router.post("/verify-otp", userController.verifyOtp);
router.post("/login", userController.login);

router.post("/forgotPassword", userController.forgotPassword);
router.get("/getotp", userController.getOtp);
router.post("/resetpassword", userController.resetPassword);

module.exports = router;
