import { Router } from 'express';
import controller from './users.controller';

export const router = Router();

router.get('/', controller.index);
router.post('/signup', controller.create);
router.post('/login', controller.login);
router.patch('/:id/update', controller.update);

export default router;
