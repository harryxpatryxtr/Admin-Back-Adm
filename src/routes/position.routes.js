const Router = require('koa-router');
const positionController = require('../controllers/position.controller');
const { validateRegister,validateUpdate,validateGetById } = require('../validators/position.validator');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizePermission = require('../middlewares/authorize.middleware');

const router = new Router();

router.post('/register', authMiddleware, authorizePermission('position:create'), validateRegister, positionController.register);
router.put('/update', authMiddleware, authorizePermission('position:update'), validateUpdate, positionController.update);
router.get('/getAll', authMiddleware, authorizePermission('position:read'), positionController.getAll);
router.get('/getById/:id', authMiddleware, authorizePermission('position:read'), validateGetById, positionController.getById);


module.exports = router;
