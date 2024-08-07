import type { Response, Request, NextFunction } from 'express';
import usersService from './users.service';
import { z } from 'zod';

export default {
    async index(req: Request, res: Response, next: NextFunction) {
        const [count, items] = await usersService.index();

        res.json({
            items,
            meta: {
                total: count,
            },
        });
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {            
            const bodySchema = z.object({
                uid: z.string().trim().uuid(),
                username: z.string().min(2).max(50),
                online: z.boolean().optional(),
            });

            const data = bodySchema.parse(req.body);

            const user = await usersService.create(data);

            res.json({ item: user });
        } catch (err) {
            next(err);
        }
    },

    async login(req: Request, res: Response, next: NextFunction) {
        try {            
            const bodySchema = z.object({
                uid: z.string().trim().uuid(),
            });

            const data = bodySchema.parse(req.body);

            const user = await usersService.login(data);

            res.json({ item: user });
        } catch (err) {
            next(err);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {            
            const paramsSchema = z.object({
                id: z.coerce.string(),
            });
    
            const params = paramsSchema.parse(req.params);

            const bodySchema = z.object({
                uid: z.string().trim().uuid().optional(),
                username: z.string().min(2).max(50).optional(),
                online: z.boolean().optional(),
            });

            const data = bodySchema.parse(req.body);
    
            const updated = await usersService.update(params, data);
    
            res.json({ updated });
        
        } catch(error) {
            next(error);
        }
    },
};
