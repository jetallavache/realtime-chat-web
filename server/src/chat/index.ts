import { Router } from 'express';

import { users } from './users';
// import { channels } from './channels';
import { messages } from './messages';

export default (): Router => {
    const app = Router();

    app.use('/users', users);
    // app.use('/channels', channels);
    app.use('/messages', messages);

    return app;
};
