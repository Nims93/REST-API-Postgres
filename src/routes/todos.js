const { json } = require('express');
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

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await pool.query(`SELECT * FROM todos WHERE id=$1`, [
      parseInt(id),
    ]);

    if (!data.rows.length) throw new Error('ID not found');

    res.json({ success: true, data: data.rows[0] });
  } catch (err) {
    if (err.message === 'ID not found')
      res.status(404).json({ success: false, message: err.message });
    console.error(err.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const {
      body: { title, content },
      params: { id },
    } = req;

    let args;
    let query;

    if (!title && !content) throw new Error('No data supplied');
    else if (!title || !content) {
      query = `UPDATE todos SET 
      title=${title ? '$1' : 'title'}, 
      content=${content ? '$1' : 'content'} 
      WHERE id=$2 returning *`;
      args = [title ? title : content, parseInt(id)];
    } else {
      query = `UPDATE todos SET 
      title=$1, content= $2 
      WHERE id=$3 returning *`;
      args = [title, content, id];
    }

    const data = await pool.query(query, args);

    if (!data.rows.length) throw new Error('ID not found');

    res.json({ success: true, data: data.rows[0] });
  } catch (err) {
    if (err.message === 'No data supplied') {
      res.status(400).json({ success: false, message: err.message });
    } else if (err.message === 'ID not found') {
      res.status(404).json({ success: false, message: err.message });
    }
    console.error(err.message);
    // res.status(400).json({ success: false, message: err.message });
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
