const router = require('express').Router();
const { Todo, Category } = require('../models');
const { auth } = require('../middlewares/auth');
const { success, fail } = require('../utils/response');

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

// PUT (update) an existing Todo item by ID
router.put('/:id', auth, async (req, res) => {
  try {
    const [numAffectedRows, affectedRows] = await Todo.update(
      { ...req.body },
      { where: { id: req.params.id, userId: req.user.id }, returning: true }
    );
    if (numAffectedRows > 0) {
      res.json(success(affectedRows[0]));
    } else {
      res.status(404).json(fail(`Todo item with ID ${req.params.id} not found`));
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(fail('Error updating Todo item'));
  }
});

// DELETE an existing Todo item by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    const numAffectedRows = await Todo.destroy({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (numAffectedRows > 0) {
      res.json(success(`Todo item with ID ${req.params.id} deleted`));
    } else {
      res.status(404).json(fail(`Todo item with ID ${req.params.id} not found`));
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(fail('Error deleting Todo item'));
  }
});

module.exports = router;
