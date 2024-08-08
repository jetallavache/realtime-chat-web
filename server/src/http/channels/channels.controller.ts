import type { Response, Request, NextFunction } from 'express';
import channelsService from './channels.service';
import { z } from 'zod';

export default {
    async index(req: Request, res: Response, next: NextFunction) {
        const [count, items] = await channelsService.index();

        res.json({
            items,
            meta: {
                total: count,
            },
        });
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.body);

            const bodySchema = z.object({
                title: z.string().min(2).max(50),
                description: z.string().max(200).optional(),
                creatorUid: z.string(),
            });

            const data = bodySchema.parse(req.body);

            const result = channelsService.create(data);

            res.json({ item: result });
        } catch (err) {
            next(err);
        }
    },

    async createShow(req: Request, res: Response, next: NextFunction) {
        try {
            res.json({ data: {}, values: {} });
        } catch (error) {
            next(error);
        }
    },

    async updateShow(req: Request, res: Response, next: NextFunction) {
        try {
            const paramsSchema = z.object({
                id: z.coerce.string(),
            });

            const params = paramsSchema.parse(req.params);

            const data = await channelsService.show(params);

            res.json({ data: data, values: {} });
        } catch (error) {
            next(error);
        }
    },
};
