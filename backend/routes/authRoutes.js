import { Router } from 'express';
import { authController } from '../controllers/authController.js';

const router = Router();

// Registro: solo admin (protegido en la ruta donde lo uses)
router.post('/register', authController.register);
// Login: público
router.post('/login', authController.login);

export default router;