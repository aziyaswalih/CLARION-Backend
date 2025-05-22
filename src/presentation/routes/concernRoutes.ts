import { Router } from 'express';
import { ConcernController } from '../controllers/ConcernController';

const router = Router();
const controller = new ConcernController();

router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.put('/:id', controller.updateStatus);
router.delete('/:id', controller.delete);

export default router;
