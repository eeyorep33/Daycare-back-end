const express = require('express');
const studentController = require('../controllers/student');
const router = express.Router();
const { body } = require('express-validator/check');
const isAuth = require('../middleware/is-auth');



router.get('/student/:id', isAuth, studentController.getStudent);

router.get('/students', isAuth, studentController.getStudents);

router.post('/student', isAuth, body("email").isEmail().withMessage("Please enter a valid email"),studentController.createStudent);

router.put('/student/:id', isAuth, body("email").isEmail().withMessage("Please enter a valid email"),studentController.editStudent);

router.delete('/student/:id', isAuth, studentController.deleteStudent);

router.get('/students/classroom/:id', isAuth, studentController.getStudentsByClassroom);

module.exports = router;