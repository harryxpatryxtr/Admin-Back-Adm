const Router = require('koa-router');
const domainController = require('../controllers/domain.controller');
const { validateRegister,validateUpdate,validateGetById } = require('../validators/domain.validator');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizePermission = require('../middlewares/authorize.middleware');

const router = new Router();

router.post('/register', authMiddleware, authorizePermission('domain:create'), validateRegister, domainController.register);
router.put('/update', authMiddleware, authorizePermission('domain:update'), validateUpdate, domainController.update);
router.get('/getAll', authMiddleware, authorizePermission('domain:read'), domainController.getAll);
router.get('/getById/:id', authMiddleware, authorizePermission('domain:read'), validateGetById, domainController.getById);

module.exports = router;
