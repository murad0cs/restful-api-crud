import { AppError } from '../utils/AppError.js';
import { itemSchema } from '../validators/itemValidator.js';
import itemService from '../services/itemService.js';
import { querySchema } from '../models/Item.js';

let items = []; // In-memory store

export const getItemById = async (req, res, next) => {
  try {
    const item = items.find(i => i.id === req.params.id);
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

    const timestamp = new Date().toISOString();
    const newItem = {
      id: Date.now().toString(),
      ...value,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    items.push(newItem);

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
    const index = items.findIndex(i => i.id === req.params.id);
    if (index === -1) throw new AppError('Item not found', 404);

    const { error, value } = itemSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(d => d.message)
      });
    }

    const updatedItem = {
      ...items[index],
      ...value,
      updatedAt: new Date().toISOString()
    };

    items[index] = updatedItem;

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
    const index = items.findIndex(i => i.id === req.params.id);
    if (index === -1) throw new AppError('Item not found', 404);

    items.splice(index, 1);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const getAllItems = async (req, res, next) => {
  try {
    // Validate query params
    const { value: validatedQuery, error } = querySchema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: error.details.map(d => d.message),
      });
    }

    // Call service with validated query
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
