import express from 'express';
import path from 'path';
import apiRoutes from './api/routes';

const routes = express.Router();
routes.use('/api', apiRoutes);

// Send to client spa
routes.get('*', function(req, res) {
  console.log('ip', req.ip, req.headers['x-forwarded-for']);
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

export default routes;
