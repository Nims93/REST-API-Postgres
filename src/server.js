const app = require('./app');
const PORT = process.env.SERVER_PORT || 9000;

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
