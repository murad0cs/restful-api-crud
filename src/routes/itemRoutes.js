const express = require('express');
const itemController = require('../controllers/itemController');

const router = express.Router();

// Statistics endpoint (should be before /:id route)
router.get('/stats', itemController.getStats);

// CRUD routes
router.post('/', itemController.createItem);
router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
