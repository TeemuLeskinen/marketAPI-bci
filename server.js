const express = require('express');
const app = express();
const port = 3000;

const router = require('./routes/users.js');
const fs = require('fs');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(router);

let serverInstance = null

module.exports = {
    start: () => {
        serverInstance = app.listen(port, () => {
            console.log(`API listening on port ${port}`)
    })
    },
    close: () => {
        serverInstance.close();
    }
}

