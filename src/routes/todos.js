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

module.exports = router;
