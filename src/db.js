require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'danielle1',
  host: 'localhost',
  port: 5432,
  database: 'todos_tut',
});

pool.query(
  `CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL
);`
);

pool.query(`select * from todos`);

module.exports = pool;
