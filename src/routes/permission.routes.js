const Router = require('koa-router');
const permissionController = require('../controllers/permission.controller');
const { validateRegister,validateUpdate,validateGetById } = require('../validators/permission.validator');
const authMiddleware = require('../middlewares/auth.middleware');

const router = new Router();

router.post('/register',authMiddleware,validateRegister, permissionController.register);
router.put('/update', authMiddleware ,validateUpdate, permissionController.update);
router.get('/getAll', authMiddleware,  permissionController.getAll);
router.get('/getById/:id', authMiddleware, validateGetById, permissionController.getById);

module.exports = router;