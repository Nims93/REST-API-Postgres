require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
});

pool.query(
  `CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL
);`
);

exports.getTodos = async () => {
  return await pool.query(`SELECT * FROM todos`);
};

exports.getTodoID = async (id) => {
  return await pool.query(`SELECT * FROM todos WHERE id=$1`, [parseInt(id)]);
};

exports.putTodoID = async (id, title, content) => {
  let query;
  let args;

  if (!title || !content) {
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

  return await pool.query(query, args);
};

exports.postTodo = async (title, content) => {
  return await pool.query(
    `INSERT INTO todos (title, content) 
    VALUES ($1, $2) returning *`,
    [title, content]
  );
};

exports.deleteTodo = async (id) => {
  return await pool.query(
    `DELETE FROM todos 
    WHERE id=$1 
    returning *`,
    [parseInt(id)]
  );
};
