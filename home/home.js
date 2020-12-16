#!/usr/bin/env node

const ejs = require('ejs');
const express = require('express');
const yargs = require('yargs');



const PORT = 5000;

var allowedHosts = [
    'jasonn.dev',
    'www.jasonn.dev'
]



const argv = yargs
    .option('local', {
        alias: 'l',
        description: 'Allow requests to localhost',
        type: 'boolean',
    })
    .help()
    .alias('help', 'h')
    .argv;

if (argv.local) {
    console.log(`Running on localhost:${PORT}`);

    allowedHosts = [`localhost:${PORT}`];
}



const app = express();

app.set('view engine', 'ejs');



function serverlog(req, code) {
    console.log(
        new Date,
        'Request: ' + req.protocol + '://' + req.get('host') + req.originalUrl,
        'Response: (' + code + ')'
    );
}



app.use('*', function(req, res, next) {
    if(allowedHosts.includes(req.get('host'))) {
        next();
    }
    else {
        const res_code = 400;
        serverlog(req, res_code);

        const res_msg = 'Bad Request';
        res.status(res_code);

        res.type('txt').send(res_msg);
        return;
    }
});



app.get('/', function(req, res) {
    const res_code = 200;
    serverlog(req, res_code);

    res.render('pages/index');
});



app.get('/about', function(req, res) {
    const res_code = 200;
    serverlog(req, res_code);

    res.render('pages/about');
});

app.get('/services', function(req, res) {
    const res_code = 200;
    serverlog(req, res_code);

    res.render('pages/services');
});

app.get('/contact', function(req, res) {
    const res_code = 200;
    serverlog(req, res_code);

    res.render('pages/contact');
});



app.get(express.static('./resources'));



app.use('*', function(req, res) {
    const res_code = 404;
    serverlog(req, res_code);

    const res_msg = 'Not found';
    res.status(res_code);

    if(req.accepts('html')) {
        res.sendFile('./resources/404.html', { root: __dirname });
        return;
    }

    if(req.accepts('json')) {
        res.json({ error: res_msg });
        return;
    }

    res.type('txt').send(res_msg);
});



app.listen(PORT);

process.on('SIGINT', function() {
    console.log('\nGracefully shutting down from SIGINT (Ctrl-C)\n');
    process.exit();
});

