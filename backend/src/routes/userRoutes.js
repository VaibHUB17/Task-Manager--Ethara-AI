const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/userController');

router.use(auth);
router.get('/', controller.search);

module.exports = router;
