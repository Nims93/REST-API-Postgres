require('dotenv').config();
const express = require('express');
const app = express();
const todosRouter = require('./routes/todos');
app.use(express.json());

app.get('/', (req, res) => {
  res.send('server working!');
});

app.use('/todos', todosRouter);

module.exports = app;
