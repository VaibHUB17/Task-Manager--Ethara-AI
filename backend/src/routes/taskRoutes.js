const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const controller = require('../controllers/taskController');

router.use(auth);
router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', roleCheck('admin'), controller.remove);
router.patch('/:id/status', controller.updateStatus);

module.exports = router;
