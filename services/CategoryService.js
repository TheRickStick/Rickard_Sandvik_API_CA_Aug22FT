const { Todo } = require('../models');
const jwt = require('jsonwebtoken');

const Op = require('sequelize').Op;

async function getAllTodosByUserId(userId) {
  return await Todo.findAll({
    where: { userId }
  });
}

async function createTodoByToken(todo, token) {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    todo.UserId = decodedToken.id;
    const res = await Todo.create(todo);
 
  } catch (err) {
  
    throw err;
  }
}

async function getTodoByIdOrNameAndUserId(idOrName, token) {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return await Todo.findOne({
      where: {
        [Op.and]: [{ id: idOrName }, { UserId: decodedToken.id }]
      }
    });
  } catch (err) {
    console.error('JWT verification error:', err);
    throw err;
  }
}

async function updateTodoByIdOrNameAndUserId(idOrName, updates, token) {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const todo = await Todo.findOne({
      where: {
        [Op.and]: [{ id: idOrName }, { UserId: decodedToken.id }]
      }
    });
    if (!todo) {
      return null;
    }
    return await todo.update(updates);
  } catch (err) {
    console.error('JWT verification error:', err);
    throw err;
  }
}

async function deleteTodoByIdOrNameAndUserId(idOrName, token) {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const todo = await Todo.findOne({
      where: {
        [Op.and]: [{ id: idOrName }, { UserId: decodedToken.id }]
      }
    });
    if (!todo) {
      return 0;
    }
    return await todo.destroy();
  } catch (err) {
    console.error('JWT verification error:', err);
    throw err;
  }
}

module.exports = {
  getAllTodosByUserId,
  createTodoByToken,
  getTodoByIdOrNameAndUserId,
  updateTodoByIdOrNameAndUserId,
  deleteTodoByIdOrNameAndUserId
};

