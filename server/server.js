const express = require('express');
const app = express();

const PORT = process.env.SERVER_PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API working!');
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
