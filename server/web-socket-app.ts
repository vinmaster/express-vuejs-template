export class WebSocketApp {
  static io: SocketIO.Server;
  static sockets: { [id: string]: any } = {};

  static setup(io) {
    this.io = io;
    this.io.on('connection', this.onConnection.bind(this));
    console.log('setup');
  }

  static onConnection(socket: SocketIO.Socket) {
    console.log('connected', socket.id);
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

  static sendAllExcept(socket: SocketIO.Socket, event: string, data) {
    socket.emit(event, data);
  }

  static sendRoom(room: string, event: string, data) {
    this.io.to(room).emit(event, data);
  }

  static sendRoomExcept(socket: SocketIO.Socket, room: string, event: string, data) {
    socket.to(room).emit(event, data);
  }

  static sendTo(socket: SocketIO.Socket, event: string, data) {
    socket.emit(event, data);
  }
}
