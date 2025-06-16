import itemModel from '../models/itemModel.js';

class ItemService {
  async getAllItems() {
    return await itemModel.findAll();
  }

  async getItemById(id) {
    const item = await itemModel.findById(id);
    if (!item) throw { status: 404, message: 'Item not found' };
    return item;
  }

  async createItem(data) {
    return await itemModel.create(data);
  }

  async updateItem(id, data) {
    const updated = await itemModel.update(id, data);
    if (!updated) throw { status: 404, message: 'Item not found' };
    return updated;
  }

  async deleteItem(id) {
    const deleted = await itemModel.delete(id);
    if (!deleted) throw { status: 404, message: 'Item not found' };
    return deleted;
  }
}

const itemService = new ItemService();
export default itemService;
