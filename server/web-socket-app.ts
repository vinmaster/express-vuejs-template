import cookie from 'cookie';
import jsonwebtoken from 'jsonwebtoken';
import { Socket } from 'socket.io';

export class WebSocketApp {
  static io: Socket;
  static sockets: { [id: string]: any } = {};

  static setup(io) {
    this.io = io;
    this.io.on('connection', this.onConnection.bind(this));
  }

  static onConnection(socket: Socket) {
    console.log('connected', socket.id);
    // let clientCookie: string = socket.handshake.headers.cookie!;
    // if (!clientCookie) {
    //   console.log('cookie not found');
    //   socket.disconnect(true);
    //   return;
    // }
    // const cookieObj = cookie.parse(clientCookie);
    // if (!cookieObj.accessToken) {
    //   console.log('force disconnect');
    //   socket.disconnect(true);
    //   return;
    // }
    // const jwt = jsonwebtoken.decode(cookieObj.accessToken);
    // if (jwt && jwt.sub) {
    //   socket['userId'] = jwt.sub;
    // }
    // console.log('cookie', jwt);
    this.sockets[socket.id] = { id: socket.id };

    this.sendAll('CONNECTED', socket.id);
    socket.on('disconnect', () => this.onDisconnect(socket));
  }

  static onDisconnect(socket) {
    console.log('disconnected', socket.id);
    this.sendAll('DISCONNECTED', socket.id);
    delete this.sockets[socket.id];
  }

  static sendAll(event: string, data) {
    this.io.emit(event, data);
  }

  static sendAllExcept(socket: Socket, event: string, data) {
    socket.emit(event, data);
  }

  static sendRoom(room: string, event: string, data) {
    this.io.to(room).emit(event, data);
  }

  static sendRoomExcept(socket: Socket, room: string, event: string, data) {
    socket.to(room).emit(event, data);
  }

  static sendTo(socket: Socket, event: string, data) {
    socket.emit(event, data);
  }
}
