const express = require('express');

const api = require('./api');

const app = express();

app.get('/', (req, res) => {
    res.json({
        message: 'NODE JS STREAM ♥',
        apiurl: '/api/v1'
    });
});

app.use('/api/v1', api);

module.exports = app;
