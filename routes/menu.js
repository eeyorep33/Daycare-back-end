const express = require('express');
const menuController = require('../controllers/menu');
const router = express.Router();
const { body } = require('express-validator/check');
const isAuth = require('../middleware/is-auth');

router.get('/menu/:id', menuController.getMenu);

module.exports = router;