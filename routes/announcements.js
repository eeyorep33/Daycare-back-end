const express = require('express');
const announceController = require('../controllers/announcements');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

router.get('/announcement/:id', isAuth, announceController.getAnnouncements);

router.put('/announcement/:id', isAuth, announceController.updateAnnouncements);

router.post('/announcement/:id', isAuth, announceController.addAnnouncements);

router.delete('/announcement/:id', isAuth, announceController.deleteAnnouncements);

module.exports = router;