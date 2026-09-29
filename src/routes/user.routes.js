const Router = require('koa-router');
const userController = require('../controllers/user.controller');
const {
  validateRegister,
  validateUpdate,
  validateGetById,
  validateList,
  validateAssignRole,
} = require('../validators/user.validator');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizePermission = require('../middlewares/authorize.middleware');

const router = new Router();

router.post('/register', authMiddleware, authorizePermission('user:create'), validateRegister, userController.register);
router.put('/update', authMiddleware, authorizePermission('user:update'), validateUpdate, userController.update);
router.get('/getAll', authMiddleware, authorizePermission('user:read'), validateList, userController.getAll);
router.get('/getById/:id', authMiddleware, authorizePermission('user:read'), validateGetById, userController.getById);
router.post('/assignRole', authMiddleware, authorizePermission('user:assign-role'), validateAssignRole, userController.assignRole);
router.post('/unassignRole', authMiddleware, authorizePermission('user:assign-role'), validateAssignRole, userController.unassignRole);

module.exports = router;
