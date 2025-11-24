const Router = require('koa-router');
const domainController = require('../controllers/domain.controller');
const { validateRegister,validateUpdate,validateGetById } = require('../validators/domain.validator');
const authMiddleware = require('../middlewares/auth.middleware');

const router = new Router();

router.post('/register',authMiddleware,validateRegister, domainController.register);
router.post('/update', authMiddleware ,validateUpdate, domainController.update);
router.get('/getAll', authMiddleware,  domainController.getAll);
router.get('/getById', authMiddleware, validateGetById, domainController.getById);

module.exports = router;