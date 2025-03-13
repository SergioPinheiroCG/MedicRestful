const express = require('express');
const { login } = require('../controllers/authController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/users', authMiddleware, authController.getAllUsers);
router.get('/users/:cpf', authMiddleware, authController.getUserByCpf); 
router.put('/users/:cpf',  authMiddleware, authController.updateUser);  
router.delete('/users/:cpf', authController.deleteUser);  

module.exports = router;
