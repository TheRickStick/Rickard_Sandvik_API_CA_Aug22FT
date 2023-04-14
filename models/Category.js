module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define('Category', {
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  });

  // create a new category
  Category.createCategory = async function (name) {
    const category = await this.create({ name });
    return category;
  };

  // retrieve all categories
  Category.getCategories = async function () {
    const categories = await this.findAll();
    return categories;
  };

  // retrieve a single category by id
  Category.getCategoryById = async function (categoryId) {
    const category = await this.findByPk(categoryId);
    return category;
  };

  // update a category by id
  Category.updateCategoryById = async function (categoryId, updates) {
    const category = await this.findByPk(categoryId);
    if (category) {
      const updatedCategory = await category.update(updates);
      return updatedCategory;
    }
    return null;
  };

  // delete a category by id
  Category.deleteCategoryById = async function (categoryId) {
    const category = await this.findByPk(categoryId);
    if (category) {
      await category.destroy();
      return true;
    }
    return false;
  };

  return Category;
};
