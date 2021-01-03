import http from 'http';
import { AddressInfo } from 'net';
import 'reflect-metadata';
import app from './app';
import { connectDatabase } from './lib/database';
import { Logger } from './lib/logger';
import { WebSocketApp } from './web-socket-app';

const port = parseInt(process.env.PORT || '8000', 10);
const server = http.createServer(app);
const io = require('socket.io')(server);
WebSocketApp.setup(io);

// Start server
server.listen(port, async () => {
  try {
    await connectDatabase();
    const addressInfo = server.address() as AddressInfo;
    let host = addressInfo.address;
    if (app.get('env') === 'development') {
      host = 'localhost';
    }
    if (app.get('env') !== 'test') {
      Logger.info(`Server listening at ${host}:${addressInfo.port}`);
    }
  } catch (error) {
    Logger.error('Cannot cannot database', error);
  }
});
