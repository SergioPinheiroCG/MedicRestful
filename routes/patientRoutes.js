const express = require('express');
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middlewares/authMiddleware');  // Caso queira proteger as rotas

const router = express.Router();

router.post('/patient', authMiddleware, patientController.createPatient);  
router.get('/patient', patientController.getAllPatients);  
router.get('/patient/:cpf', patientController.getPatientByCpf);  
router.put('/patient/:cpf',  patientController.updatePatient);  
router.delete('/patient/:cpf', patientController.deletePatient);  

module.exports = router;
