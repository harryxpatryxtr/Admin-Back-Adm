const Router = require('koa-router');
const positionController = require('../controllers/position.controller');
const { validateRegister,validateUpdate,validateGetById } = require('../validators/position.validator');
const authMiddleware = require('../middlewares/auth.middleware');

const router = new Router();

router.post('/register',authMiddleware,validateRegister, positionController.register);
router.put('/update', authMiddleware ,validateUpdate, positionController.update);
router.get('/getAll', authMiddleware,  positionController.getAll);
router.get('/getById/:id', authMiddleware, validateGetById, positionController.getById);

module.exports = router;