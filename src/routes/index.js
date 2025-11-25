const Router = require('koa-router');
const authRoutes = require('./auth.routes');
const domainRoutes = require('./domain.routes');
const userTypeRoutes = require('./userType.routes');
const documentTypeRoutes = require('./documentType.routes');
const positionRoutes = require('./position.routes');

const router = new Router();

router.use('/api/auth' ,authRoutes.routes());
router.use('/api/domain' ,domainRoutes.routes());
router.use('/api/userType', userTypeRoutes.routes());
router.use('/api/documentType', documentTypeRoutes.routes());
router.use('/api/position', positionRoutes.routes());


module.exports = router;