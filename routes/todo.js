var express = require('express');
var jsend = require('jsend');
var router = express.Router();
const { Todo, Category } = require('../models');
var jwt = require('jsonwebtoken');
const TodoService = require('../services/todoService');
//var CategoryService = require('../services/CategoryService');

router.use(jsend.middleware);

const { Op } = require('sequelize');

// middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.jsend.fail(401, 'Access denied. No token provided.');
  } else {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedToken;
      req.token = token;
      next();
    } catch (err) {
      console.error(err);
      if (err instanceof jwt.JsonWebTokenError) {
        res.jsend.fail(401, 'Invalid token.');
      } else {
        res.jsend.fail(400, 'Invalid request.');
      }
    }
  }
}



// POST a new Todo item
router.post('/', verifyToken, async (req, res) => {
  const { name, categoryId } = req.body;
  if (!name || !categoryId) {
    res.jsend.fail(400, 'Please provide the name and categoryId of the todo item');
    return;
  }
  try {
    const result = await TodoService.createTodoByToken({ name, categoryId }, req.token);
    res.jsend.success({ result });
  } catch (err) {
    console.error(err);
    res.jsend.fail(500, 'Error creating Todo item');
  }
});

// GET  Todo items
router.get('/', verifyToken, async (req, res) => {
  try {
    const todos = await TodoService.getAllTodosByUserId(req.user.id);
    res.jsend.success(todos);
  } catch (err) {
    console.error(err);
    res.jsend.fail(500, 'Error retrieving Todo items');
  }
});

// PUT an existing Todo item by ID or name
router.put('/:idOrName', verifyToken, async (req, res) => {
  try {
    const { id, name, newName, category: newCategory } = req.body;
    if (!id && !name && !newName) {
      res.jsend.fail(400, 'Provide the id, name or the newName');
    } else {
      const todo = await TodoService.getTodoByIdOrNameAndUserId(req.params.idOrName, req.user.id);
      if (!todo) {
        res.jsend.fail(404, `Todo item with ID or name '${req.params.idOrName}' not found`);
      } else {
        const updates = { ...(newName && { name: newName }), ...(newCategory && { categoryId: newCategory }) };
        await TodoService.updateTodoById(todo.id, updates);
        const updatedTodo = await TodoService.getTodoById(todo.id);
        res.jsend.success(updatedTodo);
      }
    }
  } catch (err) {
    console.error(err);
    res.jsend.fail(500, 'Error updating Todo item');
  }
});

// DELETE an existing Todo item by ID or name
router.delete('/:idOrName', verifyToken, async (req, res) => {
  try {
    const { idOrName } = req.params;
    const { deleteByCategory } = req.query;
    if (deleteByCategory) {
      // Delete the todo by category
      const category = await Category.findOne({ where: { name: idOrName } });
      if (!category) {
        res.jsend.fail(404, `Category with name '${idOrName}' not found`);
      } else {
        const numAffectedRows = await Todo.destroy({ where: { categoryId: category.id, userId: req.user.id } });
        if (numAffectedRows > 0) {
          res.jsend.success(`Todos in category '${idOrName}' deleted`);
        } else {
          res.jsend.fail(404, `No todos found in category '${idOrName}'`);
        }
      }
    } else {
      // Delete the todo by id or name
      const numAffectedRows = await TodoService.deleteTodoByIdOrNameAndUserId(idOrName, req.user.id);
      if (numAffectedRows > 0) {
        res.jsend.success(`Todo item with ID or name '${idOrName}' deleted`);
      } else {
        res.jsend.fail(404, `Todo item with ID or name '${idOrName}' not found`);
      }
    }
  } catch (err) {
    console.error(err);
    res.jsend.fail(500, 'Error deleting Todo item');
  }
});

module.exports = router;
