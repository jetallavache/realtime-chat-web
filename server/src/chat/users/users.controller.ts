import type { Response, Request } from 'express';
import usersService from './users.service';
import { z } from 'zod';

export default {
    async index(req: Request, res: Response) {
        const querySchema = z.object({
            page: z.coerce.number(),
            perPage: z.coerce.number(),
        });

        const query = querySchema.parse(req.query);

        // const [count, items] = await usersService.index(query);

        // res.json({
        //     items,
        //     meta: {
        //         total: count,
        //     },
        // });
    },
};
