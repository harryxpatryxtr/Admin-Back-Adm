const Router = require('koa-router');
const roleController = require('../controllers/role.controller');
const { validateRegister,validateUpdate,validateGetById } = require('../validators/role.validator');
const authMiddleware = require('../middlewares/auth.middleware');

const router = new Router();

router.post('/register',authMiddleware,validateRegister, roleController.register);
router.post('/update', authMiddleware ,validateUpdate, roleController.update);
router.get('/getAll', authMiddleware,  roleController.getAll);
router.get('/getById/:id', authMiddleware, validateGetById, roleController.getById);

module.exports = router;    