const express = require('express');
const app = express();
const port = 3000;

const usersRouter = require('./routes/users.js')
const fs = require('fs');
const bodyParser = require('body-parser')

app.use(bodyParser.json());

app.use(usersRouter);

app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});