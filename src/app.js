const Koa = require('koa');
const koaLogger = require('koa-logger');
const routes = require('./routes');
const bodyParser = require('koa-bodyparser');
const errorMiddleware = require('./middlewares/error.middleware');
const cors = require('@koa/cors');
const { getConfig } = require('./config/environment');
const app = new Koa();
const config = getConfig();
app.proxy = config.TRUST_PROXY;

app.use(errorMiddleware);
app.use(async (ctx, next) => {
  ctx.set('X-Content-Type-Options', 'nosniff');
  ctx.set('X-Frame-Options', 'DENY');
  ctx.set('Referrer-Policy', 'no-referrer');
  await next();
});
app.use(cors({
  origin: (ctx) => {
    const origin = ctx.get('Origin');
    return config.CORS_ORIGINS.includes(origin) ? origin : '';
  },
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['X-Request-Id'],
  credentials: false,
}));
app.use(koaLogger());
app.use(bodyParser({ jsonLimit: '1mb', formLimit: '56kb', textLimit: '56kb' }));
app.use(routes.routes());
app.use(routes.allowedMethods());
app.use((ctx) => {
  if (ctx.status === 404 && !ctx.body && !ctx.matched?.length) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      error: 'Route not found',
      requestId: ctx.state.requestId,
    };
  }
});

module.exports = app;
