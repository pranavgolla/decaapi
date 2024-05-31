const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const contentController = require('../controllers/contentController');
const servicesController=require('../controllers/servicesController')

router.post('/cc', contentController.createContent);
router.get('/cg', contentController.getAllContent);
router.get('/cg/:id', contentController.getContentById);

router.post('/sc', servicesController.createServices);
router.get('/sg', servicesController.getAllServices);
router.get('/sg/:id', servicesController.getServicesById);

router.post('/register', userController.register);
router.post('/verify-otp', userController.verifyOtp);
router.post('/login', userController.login);


module.exports = router;
