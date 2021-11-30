require('dotenv').config();
const express = require('express');
const db = require('./db');
const app = express();
const todosRouter = require('./routes/todos');
const PORT = process.env.NODE_SERVER_PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API working!');
});

app.use('/todos', todosRouter);

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
