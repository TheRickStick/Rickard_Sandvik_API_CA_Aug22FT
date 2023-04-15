const { Category } = require('../models');

async function getAllCategories() {
  return await Category.findAll();
}

async function createCategory(category) {
  return await Category.create(category);
}

async function getCategoryByIdOrName(idOrName) {
  return await Category.findOne({
    where: {
      [Op.or]: [{ id: idOrName }, { name: idOrName }],
    },
  });
}

async function updateCategoryByIdOrName(idOrName, updates) {
  const category = await getCategoryByIdOrName(idOrName);
  if (!category) {
    return null;
  }
  return await category.update(updates);
}

async function deleteCategoryByIdOrName(idOrName) {
  const category = await getCategoryByIdOrName(idOrName);
  if (!category) {
    return 0;
  }
  return await category.destroy();
}

module.exports = {
  getAllCategories,
  createCategory,
  getCategoryByIdOrName,
  updateCategoryByIdOrName,
  deleteCategoryByIdOrName,
};
