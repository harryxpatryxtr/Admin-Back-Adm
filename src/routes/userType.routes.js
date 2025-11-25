const Router = require('koa-router');
const userTypeController = require('../controllers/userType.controller');
const { validateRegister,validateUpdate,validateGetById } = require('../validators/userType.validator');
const authMiddleware = require('../middlewares/auth.middleware');

const router = new Router();

router.post('/register',authMiddleware,validateRegister, userTypeController.register);
router.put('/update', authMiddleware ,validateUpdate, userTypeController.update);
router.get('/getAll', authMiddleware,  userTypeController.getAll);
router.get('/getById/:id', authMiddleware, validateGetById, userTypeController.getById);

module.exports = router;