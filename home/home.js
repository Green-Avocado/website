#!/usr/bin/env node

const ejs = require('ejs');
const express = require('express');

const app = express();

app.set('view engine', 'ejs');



function serverlog(req, code) {
    console.log(
        new Date,
        'Request: ' + req.protocol + '://' + req.get('host') + req.originalUrl,
        'Response: (' + code + ')'
    );
}

app.get('/', function(req, res) {
    const res_code = 200;
    serverlog(req, res_code)

    res.render('pages/index');
});



app.get('/about', function(req, res) {
    const res_code = 200;
    serverlog(req, res_code)

    res.render('pages/about');
});

app.get('/services', function(req, res) {
    const res_code = 200;
    serverlog(req, res_code)

    res.render('pages/services');
});

app.get('/contact', function(req, res) {
    const res_code = 200;
    serverlog(req, res_code)

    res.render('pages/contact');
});



app.use('*', function(req, res) {
    const res_code = 404;
    serverlog(req, res_code)

    const res_msg = 'Not found';
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

