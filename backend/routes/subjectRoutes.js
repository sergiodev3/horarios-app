import { Router } from 'express';
import { subjectController } from '../controllers/subjectController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = Router();

// Listar todas las materias (solo autenticado)
router.get('/', authenticateToken, subjectController.getAll);

// Obtener materia por ID (solo autenticado)
router.get('/:id', authenticateToken, subjectController.getById);

// Crear materia (solo admin)
router.post('/', authenticateToken, isAdmin, subjectController.create);

// Actualizar materia (solo admin)
router.put('/:id', authenticateToken, isAdmin, subjectController.update);

// Eliminar materia (solo admin)
router.delete('/:id', authenticateToken, isAdmin, subjectController.delete);

export default router;