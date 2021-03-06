const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
const { body } = require('express-validator');


router.post('/login', body('password')
.trim()
.isLength({min: 7})
.not()
.isEmpty(), authController.login);

router.put('/reset/password', authController.resetPassword);


module.exports = router;