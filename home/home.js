#!/usr/bin/env node

const ejs = require('ejs');
const express = require('express');

const app = express();

function serverlog(req, code, msg) {
    console.log(
        new Date,
        'Request: ' + req.protocol + '://' + req.get('host') + req.originalUrl,
        'Response: (' + code + ') ' + msg
    );
}

app.use("*", function(req, res, next) {
    const res_msg = 'pending';
    const res_code = 'pending';

    serverlog(req, res_code, res_msg);
    next();
});

app.use('*', function(req, res) {
    const res_msg = 'Not found';
    const res_code = 404;

    serverlog(req, res_code, res_msg)
    res.status(res_code);

    if(req.accepts('html')) {
        res.sendFile('./resources/404.html', { root: __dirname });
        return ;
    }

    if(req.accepts('json')) {
        res.json({ error: res_msg });
        return;
    }

    res.type('txt').send(res_msg);
});

app.listen(3001);

process.on('SIGINT', function() {
    console.log('\nGracefully shutting down from SIGINT (Ctrl-C)\n');
    process.exit();
});

