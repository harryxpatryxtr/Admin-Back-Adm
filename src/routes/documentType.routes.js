const Router = require('koa-router');
const documentType = require('../controllers/documentType.controller');
const { validateRegister,validateUpdate,validateGetById } = require('../validators/documentType.validator');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizePermission = require('../middlewares/authorize.middleware');

const router = new Router();

router.post('/register', authMiddleware, authorizePermission('document-type:create'), validateRegister, documentType.register);
router.put('/update', authMiddleware, authorizePermission('document-type:update'), validateUpdate, documentType.update);
router.get('/getAll', authMiddleware, authorizePermission('document-type:read'), documentType.getAll);
router.get('/getById/:id', authMiddleware, authorizePermission('document-type:read'), validateGetById, documentType.getById);

module.exports = router;
