class Item {
  constructor() {
    this.items = [];
    this.counter = 1;
  }

  async create(data) {
    const newItem = {
      id: this.counter++,
      name: data.name,
      description: data.description || '',
      price: data.price || 0,
      category: data.category || 'general',
      tags: data.tags || []
    };
    this.items.push(newItem);
    return newItem;
  }

  async findAll() {
    return this.items;
  }

  async findById(id) {
    return this.items.find(item => item.id === id);
  }

  async update(id, data) {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return null;
    this.items[index] = { id, ...data };
    return this.items[index];
  }

  async delete(id) {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return null;
    return this.items.splice(index, 1)[0];
  }
}

const itemModel = new Item();
export default itemModel;
