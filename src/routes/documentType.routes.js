const Router = require('koa-router');
const documentType = require('../controllers/documentType.controller');
const { validateRegister,validateUpdate,validateGetById } = require('../validators/documentType.validator');
const authMiddleware = require('../middlewares/auth.middleware');

const router = new Router();

router.post('/register',authMiddleware,validateRegister, documentType.register);
router.post('/update', authMiddleware ,validateUpdate, documentType.update);
router.get('/getAll', authMiddleware,  documentType.getAll);
router.get('/getById/:id', authMiddleware, validateGetById, documentType.getById);

module.exports = router;