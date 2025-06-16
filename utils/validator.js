export const validateItem = (item) => {
  if (!item.name || typeof item.name !== 'string') {
    return 'Invalid input: "name" is required and must be a string.';
  }
  if (item.description && typeof item.description !== 'string') {
    return 'Invalid input: "description" must be a string.';
  }
  if (item.price && typeof item.price !== 'number') {
    return 'Invalid input: "price" must be a number.';
  }
  if (item.category && typeof item.category !== 'string') {
    return 'Invalid input: "category" must be a string.';
  }
  if (item.tags && !Array.isArray(item.tags)) {
    return 'Invalid input: "tags" must be an array.';
  }
  return null;
};
