const itemService = require('../services/itemService');
const { Item } = require('../models/Item');
const logger = require('../utils/logger');
const { AppError } = require('../utils/AppError');

class ItemController {
  async createItem(req, res, next) {
    try {
      const { error, value } = Item.validate(req.body);
      
      if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        return next(new AppError(errorMessage, 400));
      }

      const item = await itemService.createItem(value);
      
      res.status(201).json({
        success: true,
        data: item.toJSON(),
        message: 'Item created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllItems(req, res, next) {
    try {
      const { error, value } = Item.validateQuery(req.query);
      
      if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        return next(new AppError(errorMessage, 400));
      }

      const result = await itemService.getAllItems(value);
      
      res.status(200).json({
        success: true,
        data: result.items.map(item => item.toJSON()),
        pagination: result.pagination,
        message: `Retrieved ${result.items.length} items successfully`
      });
    } catch (error) {
      next(error);
    }
  }

  async getItemById(req, res, next) {
    try {
      const { id } = req.params;
      
      if (!id || id.trim() === '') {
        return next(new AppError('Item ID is required', 400));
      }

      const item = await itemService.getItemById(id);
      
      if (!item) {
        return next(new AppError('Item not found', 404));
      }

      res.status(200).json({
        success: true,
        data: item.toJSON(),
        message: 'Item retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req, res, next) {
    try {
      const { id } = req.params;
      
      if (!id || id.trim() === '') {
        return next(new AppError('Item ID is required', 400));
      }

      const { error, value } = Item.validateUpdate(req.body);
      
      if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        return next(new AppError(errorMessage, 400));
      }

      const item = await itemService.updateItem(id, value);
      
      if (!item) {
        return next(new AppError('Item not found', 404));
      }

      res.status(200).json({
        success: true,
        data: item.toJSON(),
        message: 'Item updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteItem(req, res, next) {
    try {
      const { id } = req.params;
      
      if (!id || id.trim() === '') {
        return next(new AppError('Item ID is required', 400));
      }

      const item = await itemService.deleteItem(id);
      
      if (!item) {
        return next(new AppError('Item not found', 404));
      }

      res.status(200).json({
        success: true,
        data: null,
        message: 'Item deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req, res, next) {
    try {
      const stats = await itemService.getStats();
      
      res.status(200).json({
        success: true,
        data: stats,
        message: 'Statistics retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ItemController();
