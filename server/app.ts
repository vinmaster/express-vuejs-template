import { RequestContext } from '@mikro-orm/core';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import path from 'path';
import serveFavicon from 'serve-favicon';
import { registerAuthentication } from './lib/authentication';
import { orm } from './lib/database';
import {
  expressErrorHandler,
  uncaughtExceptionHandler,
  unhandledRejectionHandler,
} from './lib/error-handlers';
import { registerLogger } from './lib/logger';
import { rateLimiter } from './lib/rate-limiter';
import { Utility } from './lib/utility';
import routes from './routes';

// Handle node errors
process.on('unhandledRejection', unhandledRejectionHandler);
process.on('uncaughtException', uncaughtExceptionHandler);

// Loads environment variables from .env file
if (Utility.env === 'development' || Utility.env === 'test') {
  require('dotenv').config();
}
Utility.verifyEnvironment();

// Create express app
const app = express();
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
// Register logger
registerLogger(app);
// Secure http headers
app.use(helmet());
// Allow cors
app.use(
  cors({
    credentials: true,
    origin: process.env.DOMAIN && (process.env.DOMAIN.split(',') as string[]),
  })
);
// Rate limiting
app.use(rateLimiter());
// Help serve favicon and skip logging
app.use(serveFavicon(path.join(__dirname, 'public', 'favicon.ico')));
// Parse request json body
app.use(express.json({ limit: '50kb' }));
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Parse cookie
app.use(cookieParser(process.env.COOKIE_SECRET));
// Protect against http parameter pollution attacks
app.use(hpp());
// Compression middleware
app.use(compression());
// Set the view engine to ejs
app.set('view engine', 'ejs');
// Set views directory
app.set('views', path.join(__dirname, '/views'));
// Authentication middleware
registerAuthentication(app);
// Give database its own request context
app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});
// Register routes
app.use('/', routes);
// Error handler for request
app.use(expressErrorHandler);

export default app;
