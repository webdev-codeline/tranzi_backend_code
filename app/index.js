require('dotenv').config();
const express = require('express');
const populationRouter = require('./routes/population');

const app = express();
const port = 5555;

app.use(express.text());

app.use('/api/population', populationRouter);

app.listen(port, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});
