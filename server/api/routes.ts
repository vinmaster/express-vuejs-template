import express from 'express';
import { notFoundHandler } from '../lib/error-handlers';
import usersRoutes from './users';

const apiRoutes = express.Router();
apiRoutes.use('/users', usersRoutes);
apiRoutes.get('/test', (req, res) => {
  res.send({ test: true });
});

// app.use(notFoundHandler);
apiRoutes.use(notFoundHandler);

export default apiRoutes;