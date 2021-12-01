const express = require('express');
const router = express.Router();
const pool = require('../db');

//route /todos/

router.get('/', async (req, res) => {
  try {
    const data = await pool.query(`SELECT * FROM todos`);
    res.json(data.rows);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ success: false, message: 'Something went wrong' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      throw new Error('One or more paramaters are missing');
    }

    const data = await pool.query(
      `INSERT INTO todos (title, content) 
      VALUES ($1, $2) returning *`,
      [title, content]
    );
    res.status(201).json({ success: true, added: data.rows[0] });
  } catch (err) {
    if (err.message === 'One or more paramaters are missing') {
      console.error(`Error: ${err.message} @ POST route: /todos`);
      res.status(400).json({ success: false, message: err.message });
    }
  }
});

module.exports = router;
