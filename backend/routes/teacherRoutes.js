import { Router } from 'express';
import { teacherController } from '../controllers/teacherController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = Router();

// Listar todos los maestros (solo autenticado)
router.get('/', authenticateToken, teacherController.getAll);

// Obtener un maestro por ID (solo autenticado)
router.get('/:id', authenticateToken, teacherController.getById);

// Crear maestro (solo admin)
router.post('/', authenticateToken, isAdmin, teacherController.create);

// Actualizar maestro (solo admin)
router.put('/:id', authenticateToken, isAdmin, teacherController.update);

// Eliminar maestro (solo admin)
router.delete('/:id', authenticateToken, isAdmin, teacherController.delete);

export default router;