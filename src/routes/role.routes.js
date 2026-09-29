const Router = require('koa-router');
const roleController = require('../controllers/role.controller');
const { validateRegister,validateUpdate,validateGetById } = require('../validators/role.validator');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizePermission = require('../middlewares/authorize.middleware');
const {
  validateSetPermission,
  validateRoleId,
  validateAssignmentId,
} = require('../validators/role-permission.validator');

const router = new Router();

router.post('/register', authMiddleware, authorizePermission('role:create'), validateRegister, roleController.register);
router.put('/update', authMiddleware, authorizePermission('role:update'), validateUpdate, roleController.update);
router.get('/getAll', authMiddleware, authorizePermission('role:read'), roleController.getAll);
router.get('/getById/:id', authMiddleware, authorizePermission('role:read'), validateGetById, roleController.getById);
router.post('/setPermission', authMiddleware, authorizePermission('role:permissions:update'), validateSetPermission, roleController.setPermission);
router.delete('/setPermission/:id', authMiddleware, authorizePermission('role:permissions:update'), validateAssignmentId, roleController.deletePermission);
router.get('/getPermissions/:roleId', authMiddleware, authorizePermission('role:read'), validateRoleId, roleController.getPermissionsByRole);

module.exports = router;
