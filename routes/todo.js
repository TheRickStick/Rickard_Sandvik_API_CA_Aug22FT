var express = require('express');
var jsend = require('jsend');
var router = express.Router();
const { Todo, Category } = require('../models');
var jwt = require('jsonwebtoken');
var TodoService = require('../services/TodoService');

router.use(jsend.middleware);

const { Op } = require('sequelize');


// middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid svin.' });
  }
}

// GET all Todo items
router.get('/', verifyToken, async (req, res) => {
  try {
    const todos = await TodoService.getAllTodosByUserId(req.user.id);
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving Todo items' });
  }
});

// POST a new Todo item
router.post('/', verifyToken, async (req, res) => {
  try {
    const todo = await TodoService.createTodoByUserId(req.body, req.user.id);
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating Todo item' });
  }
});

// PUT (update) an existing Todo item by ID or name
router.put('/:idOrName', verifyToken, async (req, res) => {
  try {
    const { id, name, newName } = req.body;
    if (!id && !name && !newName) {
      return res.status(400).json({ message: 'Provide the id, name or the newName' });
    }
    const todo = await TodoService.getTodoByIdOrNameAndUserId(req.params.idOrName, req.user.id);
    if (!todo) {
      return res.status(404).json({ message: `Todo item with ID or name '${req.params.idOrName}' not found` });
    }
    const updatedTodo = await TodoService.updateTodoByIdOrNameAndUserId(req.params.idOrName, req.body, req.user.id);
    res.json(updatedTodo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating Todo item' });
  }
});

// DELETE an existing Todo item by ID or name
router.delete('/:idOrName', verifyToken, async (req, res) => {
  try {
    const numAffectedRows = await TodoService.deleteTodoByIdOrNameAndUserId(req.params.idOrName, req.user.id);
    if (numAffectedRows > 0) {
      res.json({ message: `Todo item with ID or name '${req.params.idOrName}' deleted` });
    } else {
      res.status(404).json({ message: `Todo item with ID or name '${req.params.idOrName}' not found` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting Todo item' });
  }
});

module.exports = router;
