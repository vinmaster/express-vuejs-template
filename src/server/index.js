const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const webpackAssets = require('express-webpack-assets');
const morgan = require('morgan');

const Helper = require(`${process.cwd()}/src/server/lib/helper`);
const Logger = require(`${process.cwd()}/src/server/lib/logger`);
const Sockets = require(`${process.cwd()}/src/server/sockets`);
const routes = require(`${process.cwd()}/src/server/routes`);
const port = process.env.PORT || 8000;
const app = express(); // Create express application
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Load environment variables
if (app.get('env') === 'development' || app.get('env') === 'test') {
  require('dotenv').config(); // eslint-disable-line
}

// Handle node errors
process.on('unhandledRejection', error => {
  console.error(`unhandledRejection ${error.stack}`); // eslint-disable-line no-console
  throw error;
});
process.on('uncaughtException', error => {
  console.error(`uncaughtException ${error.stack}`); // eslint-disable-line no-console
  throw error;
});

// Morgan
if (app.get('env') === 'development') {
  app.use(morgan('dev', { skip: Helper.skipReq, stream: Logger.stream }));
} else if (app.get('env') !== 'test') {
  app.use(morgan('[:date[clf]] ":method :url" :status :response-time ms', { skip: Helper.skipReq, stream: Logger.stream }));
}

const models = require(`${process.cwd()}/src/server/models/index`);
const force = process.env.DB_FORCE_SYNC === 'true';
const SequelizeStore = require('connect-session-sequelize')(session.Store);

models.sequelize.sync({ force }).then(() => {
  console.log('Sequelize synced'); // eslint-disable-line no-console
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({
    // checkExpirationInterval: 60 * 60 * 1000, // 60 minutes. The interval at which to cleanup expired sessions in milliseconds.
    // expiration: 7 * 24 * 60 * 60 * 1000, // 7 days. The maximum age (in milliseconds) of a valid session.
    db: models.sequelize,
  }),
}));

// Dev mode
if (app.get('env') === 'development') {
  const webpack = require('webpack'); // eslint-disable-line
  const webpackConfig = require(`${process.cwd()}/config/webpack.dev.config.js`); // eslint-disable-line

  const compiler = webpack(webpackConfig); // eslint-disable-line

  const devMiddleware = require('webpack-dev-middleware')(compiler, { // eslint-disable-line
    publicPath: webpackConfig.output.publicPath,
    stats: {
      // quiet: true,
      colors: true,
      chunks: false,
    },
  });

  // Serve webpack bundle output
  app.use(devMiddleware);

  // Enable hot-reload and state-preserving. Compilation error display
  const hotMiddleware = require('webpack-hot-middleware')(compiler, { log: console.log }); // eslint-disable-line
  app.use(hotMiddleware);
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Allow CORS
app.use(cors());

// Production assets path
if (app.get('env') === 'production') {
  app.use(webpackAssets(path.join(__dirname, '../../public/js/webpack-assets.json'), { devMode: false }));
}

// Set up public folder. Need to go before routes
app.use(express.static(`${process.cwd()}/public`));

// Register routes
app.use('/', routes);

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Set views directory
app.set('views', path.join(__dirname, '/views'));

// Handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// Start server
server.listen(port, () => {
  let host = server.address().address;
  if (app.get('env') === 'development') { host = 'localhost'; }
  if (app.get('env') !== 'test') {
    Logger.info(`Server listening at http://${host}:${server.address().port}`);
  }
});
app.server = server;

// Setup socket.io
Sockets.setup(io);

module.exports = app;
