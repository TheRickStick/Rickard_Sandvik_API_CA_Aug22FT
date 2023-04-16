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
  console.log('Token:', token);
  console.log('Secret:', process.env.JWT_SECRET);

  console.log(idOrName);
  try {


    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log('idcheck');
    console.log('ID: ' + decodedToken.id );
  /*  if (decodedToken.id !== userId) {
      throw new Error('Unauthorized user');
    }*/
    return await Todo.findOne({
      where: {
        [Op.or]: [{ id: idOrName }, { name: idOrName }]
      }
    });
  } catch (err) {
    console.error('JWT verification error:', err);
    throw err;
  }
}

async function updateTodoByIdOrNameAndUserId(idOrName, updates, userId) {
  const todo = await getTodoByIdOrNameAndUserId(idOrName, userId);
  if (!todo) {
    return null;
  }
  return await todo.update(updates);
}

async function deleteTodoByIdOrNameAndUserId(idOrName, token) {
  console.log('deleting: ' + idOrName );
  const todo = await getTodoByIdOrNameAndUserId(idOrName, token);
  if (!todo) {
    return 0;
  }
  return await todo.destroy();
}

module.exports = {
  getAllTodosByUserId,
  createTodoByToken,
  getTodoByIdOrNameAndUserId,
  updateTodoByIdOrNameAndUserId,
  deleteTodoByIdOrNameAndUserId
};
