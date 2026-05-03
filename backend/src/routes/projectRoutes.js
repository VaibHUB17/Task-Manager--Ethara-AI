const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const controller = require('../controllers/projectController');

router.use(auth);
router.get('/', controller.getAll);
router.post('/', roleCheck('admin'), controller.create);
router.get('/:id', controller.getById);
router.put('/:id', roleCheck('admin'), controller.update);
router.delete('/:id', roleCheck('admin'), controller.remove);
router.post('/:id/members', roleCheck('admin'), controller.addMember);
router.delete('/:id/members/:userId', roleCheck('admin'), controller.removeMember);

module.exports = router;
