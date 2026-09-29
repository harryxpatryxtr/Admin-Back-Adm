const Router = require('koa-router');
const authRoutes = require('./auth.routes');
const domainRoutes = require('./domain.routes');
const userTypeRoutes = require('./userType.routes');
const documentTypeRoutes = require('./documentType.routes');
const positionRoutes = require('./position.routes');
const permissionRoutes = require('./permission.routes');
const roleRoutes = require('./role.routes');
const userRoutes = require('./user.routes');

const router = new Router();

router.use('/api/auth', authRoutes.routes(), authRoutes.allowedMethods());
router.use('/api/domain', domainRoutes.routes(), domainRoutes.allowedMethods());
router.use('/api/userType', userTypeRoutes.routes(), userTypeRoutes.allowedMethods());
router.use('/api/documentType', documentTypeRoutes.routes(), documentTypeRoutes.allowedMethods());
router.use('/api/position', positionRoutes.routes(), positionRoutes.allowedMethods());
router.use('/api/permission', permissionRoutes.routes(), permissionRoutes.allowedMethods());
router.use('/api/role', roleRoutes.routes(), roleRoutes.allowedMethods());
router.use('/api/user', userRoutes.routes(), userRoutes.allowedMethods());

module.exports = router;
