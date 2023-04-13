const router = require('express').Router();
const { Todo, Category } = require('../models');
const { auth } = require('./auth');
//const { success, fail } = require('../utils/response');

// GET all Todo items
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.findAll({
      where: { userId: req.user.id },
      include: { model: Category, attributes: ['name'] },
    });
    res.json(success(todos));
  } catch (err) {
    console.error(err);
    res.status(500).json(fail('Error retrieving Todo items'));
  }
});

// POST a new Todo item
router.post('/', auth, async (req, res) => {
  try {
    const todo = await Todo.create({
      ...req.body,
      userId: req.user.id,
    });
    res.json(success(todo));
  } catch (err) {
    console.error(err);
    res.status(500).json(fail('Error creating Todo item'));
  }
});

// PUT (update) an existing Todo item by ID or name
router.put('/:idOrName', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      where: {
        userId: req.user.id,
        [Op.or]: [{ id: req.params.idOrName }, { name: req.params.idOrName }],
      },
    });

    if (!todo) {
      res.status(404).json(fail(`Todo item with ID or name '${req.params.idOrName}' not found`));
    } else {
      const updatedTodo = await todo.update({ ...req.body });
      res.json(success(updatedTodo));
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(fail('Error updating Todo item'));
  }
});

// DELETE an existing Todo item by ID or name
router.delete('/:idOrName', auth, async (req, res) => {
  try {
    const numAffectedRows = await Todo.destroy({
      where: {
        userId: req.user.id,
        [Op.or]: [{ id: req.params.idOrName }, { name: req.params.idOrName }],
      },
    });

    if (numAffectedRows > 0) {
      res.json(success(`Todo item with ID or name '${req.params.idOrName}' deleted`));
    } else {
      res.status(404).json(fail(`Todo item with ID or name '${req.params.idOrName}' not found`));
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(fail('Error deleting Todo item'));
  }
});

module.exports = router;

