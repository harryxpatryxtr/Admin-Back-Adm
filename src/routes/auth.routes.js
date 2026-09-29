const Router = require('koa-router');
const authController = require('../controllers/auth.controller');
const { validateRegister, validateLogin } = require('../validators/auth.validator');
const authMiddleware = require('../middlewares/auth.middleware');
const router = new Router();

router.post('/register',validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/me', authMiddleware, authController.me);

module.exports = router;