import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../utils/AppError.js';

// Validation schemas

export const itemSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(100)
    .trim()
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 1 character long',
      'string.max': 'Name cannot exceed 100 characters'
    }),

  description: Joi.string()
    .max(500)
    .trim()
    .optional()
    .allow('')
    .messages({
      'string.max': 'Description cannot exceed 500 characters'
    }),

  price: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      'number.positive': 'Price must be a positive number'
    }),

  category: Joi.string()
    .max(50)
    .trim()
    .lowercase()
    .optional()
    .messages({
      'string.max': 'Category cannot exceed 50 characters'
    }),

  tags: Joi.array()
    .items(Joi.string().max(30).trim())
    .max(10)
    .optional()
    .messages({
      'array.max': 'Cannot have more than 10 tags',
      'string.max': 'Each tag cannot exceed 30 characters'
    }),

  isActive: Joi.boolean().optional()
});

export const updateItemSchema = Joi.object({
  name: Joi.string().min(1).max(100).trim().optional(),
  description: Joi.string().max(500).trim().optional().allow(''),
  price: Joi.number().positive().precision(2).optional(),
  category: Joi.string().max(50).trim().lowercase().optional(),
  tags: Joi.array().items(Joi.string().max(30).trim()).max(10).optional(),
  isActive: Joi.boolean().optional()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

export const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  category: Joi.string().trim().optional(),
  search: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional(),
  sortBy: Joi.string().valid('name', 'price', 'createdAt', 'updatedAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

export class Item {
  constructor(data) {
    // Validate on creation
    const { error, value } = itemSchema.validate(data, { abortEarly: false });
    if (error) throw new AppError('Validation failed', 400, error.details);

    this.id = data.id || uuidv4();
    this.name = value.name;
    this.description = value.description || '';
    this.price = value.price || 0;
    this.category = value.category || 'general';
    this.tags = value.tags || [];
    this.isActive = value.isActive !== undefined ? value.isActive : true;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  update(data) {
    // Validate update payload
    const { error, value } = updateItemSchema.validate(data, { abortEarly: false });
    if (error) throw new AppError('Validation failed', 400, error.details);

    const allowedFields = ['name', 'description', 'price', 'category', 'tags', 'isActive'];
    allowedFields.forEach(field => {
      if (value[field] !== undefined) {
        this[field] = value[field];
      }
    });

    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      category: this.category,
      tags: this.tags,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static validate(data) {
    return itemSchema.validate(data, { abortEarly: false });
  }

  static validateUpdate(data) {
    return updateItemSchema.validate(data, { abortEarly: false });
  }

  static validateQuery(query) {
    return querySchema.validate(query);
  }
}
