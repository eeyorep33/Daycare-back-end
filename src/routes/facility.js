const express = require('express');
const facilityController = require('../controllers/facility');
const router = express.Router();

router.post('/signup', facilityController.signup);

router.put('/facility/:id', facilityController.editFacility)

router.get('/facility/:id', facilityController.getFacility)

module.exports = router;