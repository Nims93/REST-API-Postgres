require('dotenv').config();
const express = require('express');
const app = express();
const todosRouter = require('./routes/todos');
const PORT = process.env.SERVER_PORT || 9000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('server working!');
});

app.use('/todos', todosRouter);

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
