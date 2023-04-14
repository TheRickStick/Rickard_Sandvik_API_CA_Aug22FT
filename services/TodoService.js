const { Todo } = require('../models');

async function getAllTodosByUserId(userId) {
  return await Todo.findAll({
    where: { userId }
  });
}

async function createTodoByUserId(todo, userId) {
  todo.userId = userId;
  return await Todo.create(todo);
}

async function getTodoByIdOrNameAndUserId(idOrName, userId) {
  return await Todo.findOne({
    where: {
      [Op.or]: [{ id: idOrName }, { name: idOrName }],
      userId
    }
  });
}

async function updateTodoByIdOrNameAndUserId(idOrName, updates, userId) {
  const todo = await getTodoByIdOrNameAndUserId(idOrName, userId);
  if (!todo) {
    return null;
  }
  return await todo.update(updates);
}

async function deleteTodoByIdOrNameAndUserId(idOrName, userId) {
  const todo = await getTodoByIdOrNameAndUserId(idOrName, userId);
  if (!todo) {
    return 0;
  }
  return await todo.destroy();
}

module.exports = {
  getAllTodosByUserId,
  createTodoByUserId,
  getTodoByIdOrNameAndUserId,
  updateTodoByIdOrNameAndUserId,
  deleteTodoByIdOrNameAndUserId
};
