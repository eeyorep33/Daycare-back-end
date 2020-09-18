const express = require('express');
const classroonController = require('../controllers/classroom');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

router.get('/classroom/:id', isAuth, classroonController.getClassroom);

router.get('/classrooms', isAuth, classroonController.getClassrooms);

router.post('/classroom', isAuth, classroonController.createClassroom);

router.put('/classroom/:id', isAuth, classroonController.editClassroom);

router.delete('/classroom/:id', isAuth, classroonController.deleteClassroom);

module.exports = router;