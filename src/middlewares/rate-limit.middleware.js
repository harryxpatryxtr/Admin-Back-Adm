const HttpError = require('../utils/http-error');

const createRateLimiter = ({ windowMs, max }) => {
  const clients = new Map();
  const maxClients = 10000;

  return async (ctx, next) => {
    const now = Date.now();
    const key = ctx.ip || ctx.request.ip || 'unknown';
    let entry = clients.get(key);

    if (!entry || entry.resetAt <= now) {
      if (clients.size >= maxClients) {
        for (const [client, clientEntry] of clients) {
          if (clientEntry.resetAt <= now) clients.delete(client);
        }
      }

      if (clients.size >= maxClients) {
        throw new HttpError(429, 'Too many requests', { code: 'RATE_LIMITED' });
      }

      entry = { count: 0, resetAt: now + windowMs };
      clients.set(key, entry);
    }

    entry.count += 1;
    if (entry.count > max) {
      ctx.set('Retry-After', String(Math.max(1, Math.ceil((entry.resetAt - now) / 1000))));
      throw new HttpError(429, 'Too many requests', { code: 'RATE_LIMITED' });
    }

    await next();
  };
};

module.exports = createRateLimiter;
