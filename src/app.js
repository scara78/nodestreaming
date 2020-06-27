const express = require('express');
var cors = require('cors')
const api = require('./api');

const app = express();


app.get('/', (req, res) => {
    res.json({
        message: 'NODE JS STREAM ♥',
        apiurl: '/api/v1'
    });
});

app.use(cors())

app.use('/api/v1', api);

module.exports = app;
