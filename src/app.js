require('dotenv').config();
const express = require('express');

module.exports = (db) => {
  const app = express();
  const todosRouter = require('./routes/todos')(db);
  app.use(express.json());

  app.get('/test', (req, res) => {
    res.send('server working!');
  });

  app.use('/todos', todosRouter);

  return app;
};
