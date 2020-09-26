import app from './app';
import { Logger } from './lib/logger';

const port = process.env.PORT || 8000;
const server = require('http').createServer(app);
// const io = require('socket.io')(server);

// Start server
server.listen(port, () => {
  let host = server.address().address;
  if (app.get('env') === 'development') {
    host = 'localhost';
  }
  if (app.get('env') !== 'test') {
    Logger.info(`Server listening at ${host}:${server.address().port}`);
  }
});
