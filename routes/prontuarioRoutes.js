const express = require('express');
const router = express.Router();
const prontuarioController = require('../controllers/prontuarioController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/prontuario/:cpf', prontuarioController.createProntuario);
router.get('/prontuario', prontuarioController.getAllProntuarios);
router.get('/prontuario/:cpf', prontuarioController.getProntuariosByPatientCpf); 
router.put('/prontuario/:cpf', prontuarioController.updateProntuario);  
router.delete('/prontuario/:cpf', prontuarioController.deleteProntuario);  

module.exports = router;

