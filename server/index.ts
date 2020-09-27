import 'reflect-metadata';
import app from './app';
import { connectDatabase } from './lib/database';
import { Logger } from './lib/logger';

const port = process.env.PORT || 8000;
const server = require('http').createServer(app);
// const io = require('socket.io')(server);

// Start server
server.listen(port, async () => {
  try {
    await connectDatabase();
    let host = server.address().address;
    if (app.get('env') === 'development') {
      host = 'localhost';
    }
    if (app.get('env') !== 'test') {
      Logger.info(`Server listening at ${host}:${server.address().port}`);
    }
  } catch (error) {
    Logger.error('Cannot cannot database', error);
  }
});
