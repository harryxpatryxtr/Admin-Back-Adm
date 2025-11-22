const Router = require('koa-router');
const authRoutes = require('./auth.routes');

const router = new Router();

router.use('/api/auth', authRoutes.routes());

module.exports = router;