const express = require('express');
const employeeController = require('../controllers/employee');
const router = express.Router();
const { body } = require('express-validator/check');
const isAuth = require('../middleware/is-auth');


router.get('/employee/:id', isAuth, employeeController.getEmployee);

router.get('/employees', isAuth, employeeController.getEmployees);

router.post('/employee', isAuth, body("email").isEmail().withMessage("Please enter a valid email"), employeeController.createEmployee);

router.put('/employee/:id',  isAuth, body("email").isEmail().withMessage("Please enter a valid email"),employeeController.editEmployee);

router.put('/userProfile/:id',  isAuth, body("email").isEmail().withMessage("Please enter a valid email"),employeeController.editUserProfile);


router.delete('/employee/:id',isAuth,  employeeController.deleteEmployee);

module.exports = router;