import { Router } from 'express';
import { scheduleController } from '../controllers/scheduleController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = Router();

// Listar todos los horarios (solo autenticado)
router.get('/', authenticateToken, scheduleController.getAll);

// Obtener horario por ID (solo autenticado)
router.get('/:id', authenticateToken, scheduleController.getById);

// Crear horario (solo admin)
router.post('/', authenticateToken, isAdmin, scheduleController.create);

// Actualizar horario (solo admin)
router.put('/:id', authenticateToken, isAdmin, scheduleController.update);

// Eliminar horario (solo admin)
router.delete('/:id', authenticateToken, isAdmin, scheduleController.delete);

export default router;