const express = require('express');
const router = express.Router();

const message_controller = require('../controllers/messageController');

/// CREATE ///
router.get('/create', message_controller.create_get);
router.post('/create', message_controller.create_post);

/// LIST ///
router.get('/', message_controller.list_all);
module.exports = router;