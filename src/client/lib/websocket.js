// Credit: https://github.com/icebob/vue-websocket

/* global io */

export default {

  install(Vue, connection, opts) {
    if (io === undefined) throw 'socket.io is not found'

    let socket

    if (connection !== null && typeof connection === 'object') {
      socket = connection
    } else {
      socket = io(connection || '', opts)
    }

    Vue.prototype.$socket = socket

    const addListeners = function() {
      if (this.$options['socket']) {
        const conf = this.$options.socket
        if (conf.namespace) {
          this.$socket = io(conf.namespace, conf.options)
        }

        if (conf.events) {
          const prefix = conf.prefix || ''
          Object.keys(conf.events).forEach((key) => {
            const func = conf.events[key].bind(this)
            this.$socket.on(prefix + key, func)
            conf.events[key].__binded = func
          })
        }
      }
    }

    const removeListeners = function() {
      if (this.$options['socket']) {
        const conf = this.$options.socket

        if (conf.namespace) {
          this.$socket.disconnect()
        }

        if (conf.events) {
          const prefix = conf.prefix || ''
          Object.keys(conf.events).forEach((key) => {
            this.$socket.off(prefix + key, conf.events[key].__binded)
          })
        }
      }
    }

    Vue.mixin({
      // Vue v1.x
      beforeCompile: addListeners,
      // Vue v2.x
      beforeCreate: addListeners,
      beforeDestroy: removeListeners
    })

  }

}
