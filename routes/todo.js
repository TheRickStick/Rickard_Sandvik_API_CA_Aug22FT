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
  const { name, CategoryId, UserId } = req.body;
  if (!name || !CategoryId) {
  
    res.jsend.fail(400, 'Please provide the name and categoryId of the todo item');
    return;
  }
  try {
    const result = await TodoService.createTodoByToken({ name, CategoryId, UserId }, req.token);
    console.log('res: ' + result);
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
router.put('/', verifyToken, async (req, res) => {
  try { 
    const { id, name, newName, category: newCategory } = req.body;
    if (!id && !name && !newName)
    {
      res.jsend.fail(400, 'Provide the id, name or the newName');
    } 
    else 
    {
      const todo = await TodoService.getTodoByIdOrNameAndUserId(req.body.idOrName, req.token);
      console.log('check: ' + todo);
      if (!todo) {
        res.jsend.fail(404, `Todo item with ID or name '${req.params.idOrName}' not found`);
      } else {
        const result = await todo.update({ name: req.body.newName });

        res.jsend.success('record updated');
      }
    }
  } catch (err) {
    console.error(err);
    res.jsend.fail(500, 'Error updating Todo item');
  }
});

// DELETE an existing Todo item by ID or name
router.delete('/', verifyToken, async (req, res) => {
  try {
    
    const idOrName  = req.body.idOrName;
    console.log("val: " + req.body.idOrName);
  
      // Delete the todo by id or name
      const numAffectedRows = await TodoService.deleteTodoByIdOrNameAndUserId(idOrName, req.token);
      if (numAffectedRows > 0) {
        res.jsend.success(`Todo item with ID or name '${idOrName}' deleted`);
      } else {
        res.jsend.fail(404, `Todo item with ID or name '${idOrName}' not found`);
      }
    }
   catch (err) {
    console.error(err);
    res.jsend.fail(500, 'Error deleting Todo item');
  }
});

module.exports = router;
