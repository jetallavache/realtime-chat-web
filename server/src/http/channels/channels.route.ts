import { Router } from 'express';
import controller from './channels.controller';

export const router = Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.get('/create', controller.createShow);
router.patch('/:id/update', controller.updateShow);
router.get('/:id', controller.updateShow);

export default router;
