module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define('Category', {
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: 'categories', 
  }
  );

  return Category;
};