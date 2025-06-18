const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

// Validation schemas
const itemSchema = Joi.object({
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

const updateItemSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(100)
    .trim()
    .optional(),
  
  description: Joi.string()
    .max(500)
    .trim()
    .optional()
    .allow(''),
  
  price: Joi.number()
    .positive()
    .precision(2)
    .optional(),
  
  category: Joi.string()
    .max(50)
    .trim()
    .lowercase()
    .optional(),
  
  tags: Joi.array()
    .items(Joi.string().max(30).trim())
    .max(10)
    .optional(),
  
  isActive: Joi.boolean().optional()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  category: Joi.string().trim().optional(),
  search: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional(),
  sortBy: Joi.string().valid('name', 'price', 'createdAt', 'updatedAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

class Item {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.description = data.description || '';
    this.price = data.price || 0;
    this.category = data.category || 'general';
    this.tags = data.tags || [];
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
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

  update(data) {
    const allowedFields = ['name', 'description', 'price', 'category', 'tags', 'isActive'];
    
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        this[field] = data[field];
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
}

module.exports = { Item, itemSchema, updateItemSchema, querySchema };
