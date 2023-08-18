const router = require('express').Router();
const { getUserById, updateUser } = require('../controllers/users');
const { validateUpdateUser } = require('../middlewares/validation');
const auth = require('../middlewares/auth');

router.use(auth);
router.get('/me', getUserById);
router.patch('/me', validateUpdateUser, updateUser);

module.exports = router;
