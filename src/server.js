const makeApp = require('./app');
const db = require('./db');
const PORT = process.env.SERVER_PORT || 9000;

const app = makeApp(db);

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
