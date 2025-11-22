const Koa = require('koa');
const koaLogger = require('koa-logger');
const routes = require('./routes');
const bodyParser = require('koa-bodyparser');
const errorMiddleware = require('./middlewares/error.middleware');

const app = new Koa();

// Middlewares globales
app.use(errorMiddleware);
app.use(koaLogger());
app.use(bodyParser());
// Rutas
app.use(routes.routes());
app.use(routes.allowedMethods());

module.exports = app;