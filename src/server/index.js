const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const webpackAssets = require('express-webpack-assets')
const Logger = require(process.cwd() + '/src/server/lib/logger')
const Sockets = require(process.cwd() + '/src/server/sockets')
const routes = require(process.cwd() + '/src/server/routes')
const port = process.env.PORT || 8000
const app = express() // Create express application
const server = require('http').createServer(app)
const io = require('socket.io')(server)

// Load environment variables
if (app.get('env') === 'development' || app.get('env') === 'test') {
  require('dotenv').config()
}

// Dev mode
if (app.get('env') === 'development') {
  const webpack = require('webpack')
  const webpackConfig = require(process.cwd() + '/config/webpack.dev.config.js')

  const compiler = webpack(webpackConfig)

  const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      // quiet: true,
      colors: true,
      chunks: false
    }
  })

  // Serve webpack bundle output
  app.use(devMiddleware)

  // Enable hot-reload and state-preserving. Compilation error display
  const hotMiddleware = require('webpack-hot-middleware')(compiler, { log: console.log })
  app.use(hotMiddleware)
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Allow CORS
app.use(cors())

// Production assets path
if (app.get('env') === 'production') {
  app.use(webpackAssets(path.join(__dirname, '../../public/js/webpack-assets.json'), { devMode: false }))
}

// Set up public folder. Need to go before routes
app.use(express.static(process.cwd() + '/public'))

// Register routes
app.use('/', routes)

// Set the view engine to ejs
app.set('view engine', 'ejs')

// Set views directory
app.set('views', path.join(__dirname, '/views'))

// Handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// Start server
server.listen(port, function() {
  let host = server.address().address
  if (app.get('env') === 'development') { host = 'localhost' }
  if (app.get('env') !== 'test') {
    Logger.info('Server listening at http://' + host + ':' + server.address().port)
  }
})
app.server = server

// Setup socket.io
Sockets.setup(io)

module.exports = app
