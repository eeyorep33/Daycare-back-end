const express = require('express');
const reportController = require('../controllers/report');
const router = express.Router();
const { body } = require('express-validator');
const isAuth = require('../middleware/is-auth');


router.get('/report/:id', reportController.getReport);

router.get('/report/archive/:id', reportController.getArchiveReport);

router.get('/report/list/:id', reportController.getReportList)

router.post('/report', isAuth, reportController.createReport);

router.post('/feeding', reportController.createFeeding);

router.put('/feeding/:id', isAuth, reportController.editFeeding);

router.delete('/feeding/:id',isAuth,  reportController.deleteFeeding);

router.post('/diapering', isAuth, reportController.createDiapering);

router.put('/diapering/:id',isAuth,  reportController.editDiapering);

router.delete('/diapering/:id', isAuth, reportController.deleteDiapering);

router.post('/naptime', isAuth, reportController.createNaptime);

router.put('/naptime/:id', isAuth, reportController.editNaptime);

router.delete('/naptime/:id', isAuth, reportController.deleteNaptime);

router.post('/playtime', isAuth, reportController.createPlaytime);

router.put('/playtime/:id',isAuth,  reportController.editPlaytime);

router.delete('/playtime/:id', isAuth, reportController.deletePlaytime);

router.post('/medicine', isAuth, reportController.createMedicine);

router.put('/medicine/:id', isAuth, reportController.editMedicine);

router.delete('/medicine/:id', isAuth, reportController.deleteMedicine);

router.post('/supplies', isAuth, reportController.createSupplies);

router.put('/supplies/:id', isAuth, reportController.editSupplies);

router.delete('/supplies/:id', isAuth, reportController.deleteSupplies);

router.post('/comment', isAuth, reportController.createComment);

router.put('/comment/:id', isAuth, reportController.editComment);

router.delete('/comment/:id', isAuth, reportController.deleteComment);


module.exports = router;



