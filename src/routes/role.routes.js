const Router = require('koa-router');
const roleController = require('../controllers/role.controller');
const { validateRegister,validateUpdate,validateGetById } = require('../validators/role.validator');
const authMiddleware = require('../middlewares/auth.middleware');

const router = new Router();

router.post('/register',authMiddleware,validateRegister, roleController.register);
router.put('/update', authMiddleware ,validateUpdate, roleController.update);
router.get('/getAll', authMiddleware,  roleController.getAll);
router.get('/getById/:id', authMiddleware, validateGetById, roleController.getById);
router.post('/setPermission', authMiddleware,  roleController.setPermission);
router.delete('/setPermission/:id', authMiddleware,  roleController.deletePermission);


module.exports = router;    