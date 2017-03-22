const Logger = require(process.cwd() + '/src/server/lib/logger')

class Sockets {
  static setup(io) {
    this.io = io
    this.io.on('connection', this.connectionCallback.bind(this))
  }

  static listSockets() {
    if (this.io) {
      const sockets = this.io.sockets.connected
      return Object.keys(sockets)
    } else {
      Logger.log('this.io is not set')
    }
  }

  static connectionCallback(socket) {
    this.io.emit(Sockets.CONSTANTS.CONNECTED, { id: socket.id })

    socket.on('sendText', (text) => {
      socket.emit('sendText', 'Sent from server')
    })

    socket.on('disconnect', function(data) {
      this.io.emit(Sockets.CONSTANTS.DISCONNECTED, { id: socket.id })
    }.bind(this))
  }
}

Sockets.CONSTANTS = {
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
}

module.exports = Sockets
