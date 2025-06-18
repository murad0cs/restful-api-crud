import { Item } from '../models/Item.js';
import logger from '../utils/logger.js';
import { AppError } from '../utils/AppError.js';

class ItemService {
  constructor() {
    // In-memory data store (replace with database in production)
    this.items = new Map();
    this._seedData();
  }

  _seedData() {
    // Add sample data for testing
    const sampleItems = [
      {
        name: 'MacBook Pro',
        description: 'High-performance laptop for development and creative work',
        price: 2499.99,
        category: 'electronics',
        tags: ['laptop', 'apple', 'development', 'creative']
      },
      {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with precision tracking',
        price: 79.99,
        category: 'electronics',
        tags: ['mouse', 'wireless', 'ergonomic']
      },
      {
        name: 'Coffee Mug',
        description: 'Ceramic coffee mug perfect for morning coffee',
        price: 15.99,
        category: 'kitchen',
        tags: ['coffee', 'ceramic', 'mug']
      },
      {
        name: 'Mechanical Keyboard',
        description: 'Premium mechanical keyboard with RGB lighting',
        price: 149.99,
        category: 'electronics',
        tags: ['keyboard', 'mechanical', 'rgb', 'gaming']
      },
      {
        name: 'Notebook',
        description: 'High-quality lined notebook for writing',
        price: 12.99,
        category: 'stationery',
        tags: ['notebook', 'writing', 'paper']
      }
    ];

    sampleItems.forEach(itemData => {
      const item = new Item(itemData);
      this.items.set(item.id, item);
    });

    logger.info(`Seeded ${sampleItems.length} sample items`);
  }

  async createItem(itemData) {
    try {
      const item = new Item(itemData);
      this.items.set(item.id, item);
      
      logger.info(`Created item: ${item.name} (ID: ${item.id})`);
      return item;
    } catch (error) {
      logger.error('Error creating item:', { error: error.message, data: itemData });
      throw new AppError('Failed to create item', 500);
    }
  }

  async getAllItems(options = {}) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        category, 
        search, 
        isActive,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options;

      let items = Array.from(this.items.values());

      // Filter by active status
      if (isActive !== undefined) {
        items = items.filter(item => item.isActive === isActive);
      }

      // Filter by category
      if (category) {
        items = items.filter(item => 
          item.category.toLowerCase().includes(category.toLowerCase())
        );
      }

      // Search in name, description, and tags
      if (search) {
        const searchTerm = search.toLowerCase();
        items = items.filter(item =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }

      // Sorting
      items.sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'price':
            comparison = a.price - b.price;
            break;
          case 'createdAt':
            comparison = new Date(a.createdAt) - new Date(b.createdAt);
            break;
          case 'updatedAt':
            comparison = new Date(a.updatedAt) - new Date(b.updatedAt);
            break;
          default:
            comparison = new Date(a.createdAt) - new Date(b.createdAt);
        }
        
        return sortOrder === 'desc' ? -comparison : comparison;
      });

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedItems = items.slice(startIndex, endIndex);

      const result = {
        items: paginatedItems,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: items.length,
          pages: Math.ceil(items.length / limit),
          hasNext: endIndex < items.length,
          hasPrev: startIndex > 0
        }
      };

      logger.info(`Retrieved ${paginatedItems.length} items (page ${page})`);
      return result;
    } catch (error) {
      logger.error('Error fetching items:', { error: error.message, options });
      throw new AppError('Failed to retrieve items', 500);
    }
  }

  async getItemById(id) {
    try {
      const item = this.items.get(id);
      
      if (!item) {
        logger.warn(`Item not found: ${id}`);
        return null;
      }

      logger.info(`Retrieved item: ${item.name} (ID: ${id})`);
      return item;
    } catch (error) {
      logger.error(`Error fetching item ${id}:`, { error: error.message });
      throw new AppError('Failed to retrieve item', 500);
    }
  }

  async updateItem(id, updateData) {
    try {
      const item = this.items.get(id);
      
      if (!item) {
        logger.warn(`Item not found for update: ${id}`);
        return null;
      }

      const oldData = { ...item };
      item.update(updateData);
      this.items.set(id, item);
      
      logger.info(`Updated item: ${item.name} (ID: ${id})`, {
        changes: updateData,
        oldData: oldData
      });
      
      return item;
    } catch (error) {
      logger.error(`Error updating item ${id}:`, { error: error.message, updateData });
      throw new AppError('Failed to update item', 500);
    }
  }

  async deleteItem(id) {
    try {
      const item = this.items.get(id);
      
      if (!item) {
        logger.warn(`Item not found for deletion: ${id}`);
        return null;
      }

      this.items.delete(id);
      logger.info(`Deleted item: ${item.name} (ID: ${id})`);
      return item;
    } catch (error) {
      logger.error(`Error deleting item ${id}:`, { error: error.message });
      throw new AppError('Failed to delete item', 500);
    }
  }

  async getStats() {
    try {
      const items = Array.from(this.items.values());
      const activeItems = items.filter(item => item.isActive);
      
      // Calculate category distribution
      const categoryStats = items.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {});

      // Calculate price statistics
      const prices = items.map(item => item.price).filter(price => price > 0);
      const avgPrice = prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0;
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

      const stats = {
        totalItems: items.length,
        activeItems: activeItems.length,
        inactiveItems: items.length - activeItems.length,
        categories: {
          total: Object.keys(categoryStats).length,
          distribution: categoryStats
        },
        pricing: {
          average: Math.round(avgPrice * 100) / 100,
          minimum: minPrice,
          maximum: maxPrice,
          itemsWithPrice: prices.length
        },
        lastUpdated: new Date().toISOString()
      };
      
      logger.info('Generated statistics', { totalItems: stats.totalItems });
      return stats;
    } catch (error) {
      logger.error('Error calculating stats:', { error: error.message });
      throw new AppError('Failed to calculate statistics', 500);
    }
  }
}

// Singleton instance
const itemService = new ItemService();

export default itemService;
