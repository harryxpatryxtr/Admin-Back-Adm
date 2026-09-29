const Router = require('koa-router');
const userTypeController = require('../controllers/userType.controller');
const { validateRegister,validateUpdate,validateGetById } = require('../validators/userType.validator');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizePermission = require('../middlewares/authorize.middleware');

const router = new Router();

router.post('/register', authMiddleware, authorizePermission('user-type:create'), validateRegister, userTypeController.register);
router.put('/update', authMiddleware, authorizePermission('user-type:update'), validateUpdate, userTypeController.update);
router.get('/getAll', authMiddleware, authorizePermission('user-type:read'), userTypeController.getAll);
router.get('/getById/:id', authMiddleware, authorizePermission('user-type:read'), validateGetById, userTypeController.getById);

module.exports = router;
