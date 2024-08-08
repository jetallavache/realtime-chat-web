import { Router } from 'express';

import { users } from './users';
import { channels } from './channels';

export default (): Router => {
    const app = Router();

    app.use('/users', users);
    app.use('/channels', channels);

    return app;
};
