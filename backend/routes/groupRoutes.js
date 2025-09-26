import { Router } from 'express';
import { groupController } from '../controllers/groupController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = Router();

// Listar todos los grupos (solo autenticado)
router.get('/', authenticateToken, groupController.getAll);

// Obtener grupo por ID (solo autenticado)
router.get('/:id', authenticateToken, groupController.getById);

// Crear grupo (solo admin)
router.post('/', authenticateToken, isAdmin, groupController.create);

// Actualizar grupo (solo admin)
router.put('/:id', authenticateToken, isAdmin, groupController.update);

// Eliminar grupo (solo admin)
router.delete('/:id', authenticateToken, isAdmin, groupController.delete);

export default router;