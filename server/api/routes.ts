import express from 'express';
import { notFoundHandler } from '../lib/error-handlers';
import { Utility } from '../lib/utility';
import usersRoutes from './users';

const apiRoutes = express.Router();
apiRoutes.use((req, res, next) => {
  console.log('req header', req.headers);
  if (req.headers['x-requested-with'] !== 'XmlHttpRequest') {
    throw Utility.createError('Forbidden', 403);
  }
  next();
});
apiRoutes.use('/users', usersRoutes);
apiRoutes.get('/test', (req, res) => {
  res.send({ test: true });
});

// app.use(notFoundHandler);
apiRoutes.use(notFoundHandler);

export default apiRoutes;
