var express = require('express');
var jsend = require('jsend');
var router = express.Router();
const { Todo, Category } = require('../models');
var jwt = require('jsonwebtoken');
const TodoService = require('../services/todoService');

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
  const { name, CategoryId, UserId } = req.body;
  if (!name || !CategoryId || !UserId) {
    res.jsend.fail(400, 'Please provide name, CategoryId and UserId');
    return;
  }
  try {
    const todo = await TodoService.createTodo(name, CategoryId, UserId);
    res.jsend.success(todo);
  } catch (err) {
    console.error(err);
    res.jsend.fail(500, 'Error creating Todo');
  }
});

// GET all Todo items for a particular Category
router.get('/:categoryId', verifyToken, async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const category = await Category.findOne({
      where: {
        [Op.and]: [
          { id: categoryId },
          { userId: req.user.id }
        ]
      }
    });
    if (!category) {
      res.jsend.fail(404, `Category with ID '${categoryId}' not found`);
      return;
    }
    const todos = await TodoService.getTodosByCategoryId(categoryId);
    res.jsend.success(todos);
  } catch (err) {
    console.error(err);
    res.jsend.fail(500, 'Error retrieving Todo items');
  }
});

// PUT an existing Todo item by ID or name
router.put('/:idOrName', verifyToken, async (req, res) => {
  try {
    const { id, name, newName, CategoryId, completed } = req.body;
    if (!id && !name && !newName && !CategoryId && !completed) {
      res.jsend.fail(400, 'Provide id, name, newName, CategoryId or completed');
    } else {
      const todo = await TodoService.getTodoByIdOrName(req.params.idOrName);
      if (!todo) {
        res.jsend.fail(404, `Todo item with ID or name '${req.params.idOrName}' not found`);
      } else {
        const updates = {
          ...(newName && { name: newName }),
          ...(CategoryId && { CategoryId }),
          ...(completed !== undefined && { completed })
        };
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

// DELETE an existing Category by ID or name
router.delete('/:idOrName', verifyToken, async (req, res) => {
    try {
      const { idOrName } = req.params;
      const { deleteWithTodos } = req.query;
      const category = await Category.findOne({
        where: {
          [Op.or]: [{ id: idOrName }, { name: idOrName }],
          userId: req.user.id
        }
      });
      if (!category) {
        res.jsend.fail(404, `Category with ID or name '${idOrName}' not found`);
        return;
      }
      if (deleteWithTodos) {
        const numAffectedRows = await CategoryService.deleteCategoryWithTodos(category.id);
        if (numAffectedRows > 0) {
          res.jsend.success(`Category with ID or name '${idOrName}' and all associated todos deleted`);
        } else {
          res.jsend.fail(404, `Category with ID or name '${idOrName}' has no associated todos`);
        }
      } else {
        await Category.destroy({ where: { id: category.id } });
        res.jsend.success(`Category with ID or name '${idOrName}' deleted`);
      }
    } catch (err) {
      console.error(err);
      res.jsend.fail(500, 'Error deleting Category');
    }
  });
  
  module.exports = router;
  