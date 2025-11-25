const Router = require('koa-router');
const userController = require('../controllers/user.controller');
const { validateRegister,validateUpdate,validateGetById } = require('../validators/user.validator');
const authMiddleware = require('../middlewares/auth.middleware');

const router = new Router();

router.post('/register',authMiddleware,validateRegister, userController.register);
router.post('/update', authMiddleware ,validateUpdate, userController.update);
router.get('/getAll', authMiddleware,  userController.getAll);
router.get('/getById/:id', authMiddleware, validateGetById, userController.getById);

module.exports = router;