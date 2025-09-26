import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = Router();


router.get('/', authenticateToken, isAdmin, userController.getAll); // solo admin puede listar usuarios
router.get('/:id', authenticateToken, isAdmin, userController.getById);
router.post('/', authenticateToken, isAdmin, userController.create); // crear usuario (registro)
router.put('/:id/password', authenticateToken, isAdmin, userController.updatePassword); // cambiar password de otro usuario
router.delete('/:id', authenticateToken, isAdmin, userController.delete);

export default router;