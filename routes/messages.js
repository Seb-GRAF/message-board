const express = require('express');
const router = express.Router();

const message_controller = require('../controllers/messageController');

/// CREATE ///
router.get('/create', message_controller.create_get);
router.post('/create', message_controller.create_post);

/// EDIT ///
router.get('/:id/edit', message_controller.edit_get);
router.post('/:id/edit', message_controller.edit_post);

/// DELETE ///
router.get('/:id/delete', message_controller.delete_get);
router.post('/:id/delete', message_controller.delete_post);

/// LIST ///
router.get('/', message_controller.list_all);
module.exports = router;
