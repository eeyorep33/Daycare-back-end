const express = require('express');
const facilityController = require('../controllers/facility');
const router = express.Router();

router.post('/signup', facilityController.signup);

module.exports = router;