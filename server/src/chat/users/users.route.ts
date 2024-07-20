import { Router } from 'express';
import controller from './users.controller';

export const router = Router();

router.get('/', controller.index);

export default router;
