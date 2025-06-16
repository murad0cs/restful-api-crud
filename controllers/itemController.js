import itemService from '../services/itemService.js';
import { validateItem } from '../utils/validator.js';

export const getAllItems = async (req, res, next) => {
  try {
    const items = await itemService.getAllItems();
    res.json(items);
  } catch (err) {
    next(err);
  }
};

export const getItemById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const item = await itemService.getItemById(id);
    res.json(item);
  } catch (err) {
    next(err);
  }
};

export const createItem = async (req, res, next) => {
  try {
    const error = validateItem(req.body);
    if (error) throw { status: 400, message: error };

    const newItem = await itemService.createItem(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    next(err);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const error = validateItem(req.body);
    if (error) throw { status: 400, message: error };

    const updated = await itemService.updateItem(id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await itemService.deleteItem(id);
    res.json(deleted);
  } catch (err) {
    next(err);
  }
};
