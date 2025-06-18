import { AppError } from '../utils/AppError.js';
import { itemSchema } from '../validators/itemValidator.js';
import itemService from '../services/itemService.js';
import { querySchema } from '../models/Item.js';

export const getItemById = async (req, res, next) => {
  try {
    const item = await itemService.getItemById(req.params.id);
    if (!item) throw new AppError('Item not found', 404);
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

export const createItem = async (req, res, next) => {
  try {
    const { error, value } = itemSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(d => d.message)
      });
    }

    const newItem = await itemService.createItem(value);

    res.status(201).json({
      success: true,
      data: newItem,
    });
  } catch (err) {
    next(err);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const { error, value } = itemSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(d => d.message)
      });
    }

    const updatedItem = await itemService.updateItem(req.params.id, value);
    if (!updatedItem) throw new AppError('Item not found', 404);

    res.status(200).json({
      success: true,
      data: updatedItem,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    const deletedItem = await itemService.deleteItem(req.params.id);
    if (!deletedItem) throw new AppError('Item not found', 404);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const getAllItems = async (req, res, next) => {
  try {
    const { value: validatedQuery, error } = querySchema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: error.details.map(d => d.message),
      });
    }

    const result = await itemService.getAllItems(validatedQuery);

    res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};
