const express = require('express');

module.exports = (database) => {
  //route /todos
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const data = await database.getTodos();
      res.json(data.rows);
    } catch (err) {
      res.status(400).json({ success: false, message: 'Something went wrong' });
    }
  });

  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const data = await database.getTodoID(id);

      if (!data.rows.length) throw new Error('ID not found');

      res.json({ success: true, data: data.rows[0] });
    } catch (err) {
      if (err.message === 'ID not found')
        res.status(404).json({ success: false, message: err.message });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const {
        body: { title, content },
        params: { id },
      } = req;

      if (!title && !content) throw new Error('No data supplied');

      const data = await database.putTodoID(id, title, content);

      if (!data.rows.length) throw new Error('ID not found');

      res.json({ success: true, data: data.rows[0] });
    } catch (err) {
      if (err.message === 'No data supplied') {
        res.status(400).json({ success: false, message: err.message });
      } else if (err.message === 'ID not found') {
        res.status(404).json({ success: false, message: err.message });
      } else {
        console.error(err.message);
        res.status(400).json({ success: false, message: err.message });
      }
    }
  });

  router.post('/', async (req, res) => {
    try {
      const { title, content } = req.body;
      if (!title || !content) {
        throw new Error('One or more paramaters are missing');
      }

      const data = await database.postTodo(title, content);

      res.status(201).json({ success: true, added: data.rows[0] });
    } catch (err) {
      if (err.message === 'One or more paramaters are missing') {
        res.status(400).json({ success: false, message: err.message });
      }
    }
  });

  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const data = await database.deleteTodo(id);

      if (!data.rows.length) throw new Error('Database ID not found');

      res.json({ success: true, data: data.rows[0] });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  return router;
};
