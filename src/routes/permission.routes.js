const Router = require('koa-router');
const permissionController = require('../controllers/permission.controller');
const { validateRegister,validateUpdate,validateGetById } = require('../validators/permission.validator');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizePermission = require('../middlewares/authorize.middleware');

const router = new Router();

router.post('/register', authMiddleware, authorizePermission('permission:create'), validateRegister, permissionController.register);
router.put('/update', authMiddleware, authorizePermission('permission:update'), validateUpdate, permissionController.update);
router.get('/getAll', authMiddleware, authorizePermission('permission:read'), permissionController.getAll);
router.get('/getById/:id', authMiddleware, authorizePermission('permission:read'), validateGetById, permissionController.getById);

module.exports = router;
