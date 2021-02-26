const express = require('express');
const app = express();
//const port = 3000;

const router = require('./routes/users.js');
const fs = require('fs');
const bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 80));

app.use(bodyParser.json());
app.use(router);

let serverInstance = null

module.exports = {
    start: () => {
        serverInstance = app.listen(app.get('port'), () => {
            console.log('API running on port', app.get('port'));
    })
    },
    close: () => {
        serverInstance.close();
    }
}

