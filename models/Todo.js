module.exports = (sequelize, Sequelize) => {
  const Todo = sequelize.define('Todo', {
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    
    userId: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
  );

  Todo.associate = function (models) {
    Todo.belongsTo(models.Category, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
    Todo.belongsTo(models.User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
  };

  return Todo;
};
