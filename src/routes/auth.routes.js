const Router = require('koa-router');
const authController = require('../controllers/auth.controller');
const { validateRegister, validateLogin, validateRefresh } = require('../validators/auth.validator');
const authMiddleware = require('../middlewares/auth.middleware');
const createRateLimiter = require('../middlewares/rate-limit.middleware');

const router = new Router();
const loginLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 10 });
const refreshLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 30 });
const registrationLimiter = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 5 });

router.post('/register', registrationLimiter, validateRegister, authController.register);
router.post('/login', loginLimiter, validateLogin, authController.login);
router.post('/refresh', refreshLimiter, validateRefresh, authController.refreshToken);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
