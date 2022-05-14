import http from 'http';
import { AddressInfo } from 'net';
import 'reflect-metadata';
import app from './app';
import * as db from './lib/database';
import { Logger } from './lib/logger';
import { WebSocketApp } from './web-socket-app';

const port = parseInt(process.env.PORT || '8000', 10);
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: process.env.DOMAIN, credentials: true },
});
WebSocketApp.setup(io);

// Start server
server.listen(port, async () => {
  try {
    await db.connect();
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
