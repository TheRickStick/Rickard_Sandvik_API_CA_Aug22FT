module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define('Category', {
    name: {
      type: Sequelize.DataTypes.STRING,

      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
  );

  Category.bulkCreate([
    { name: 'Cleaning' },
    { name: 'Working Out' },
    { name: 'Grocery Shopping' },
    { name: 'Meeting' },
    { name: 'Travel Planning' }
  ]);

  return Category;
};
