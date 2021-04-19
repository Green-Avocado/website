#!/usr/bin/env node

const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const nocache = require('nocache');
const yargs = require('yargs');

const argv = yargs
    .option('debug', {
        alias: 'd',
        description: 'Allow requests from localhost',
        type: 'boolean',
    })
    .help()
    .alias('help', 'h')
    .argv;

const PORT = 5010;

const whitelist = [
    'https://www.jasonn.dev',
    'https://blog.jasonn.dev',
    'https://projects.jasonn.dev',
]

const whitelist_debug = [
    'http://localhost:5000',
    'http://localhost:5020',
    'http://localhost:5030',
]

const corsOptions = {
    origin: argv.debug? whitelist_debug : whitelist,
}

const api = express();

function serverlog(req, code) {
    console.log(
        new Date,
        'Request: ' + req.protocol + '://' + req.get('host') + req.originalUrl,
        'Response: (' + code + ')'
    );
}

api.use(helmet());
api.use(nocache());

api.use('*', cors(corsOptions));

api.get('*', function(req, res) {
    const res_code = 501;
    serverlog(req, res_code)

    const res_msg = 'Not implemented';
    res.status(res_code);

    if(req.accepts('json')) {
        res.json({ error: res_msg });
        return;
    }

    res.type('txt').send(res_msg);
    return;
});

api.use('*', function(req, res) {
    const res_code = 404;
    serverlog(req, res_code)

    const res_msg = 'Not found';
    res.status(res_code);

    if(req.accepts('json')) {
        res.json({ error: res_msg });
        return;
    }

    res.type('txt').send(res_msg);
    return;
});

api.listen(PORT);

process.on('SIGINT', function() {
    console.log('\nGracefully shutting down from SIGINT (Ctrl-C)\n');
    process.exit();
});

process.on('uncaughtException', function (err) {
    console.log('Uncaught exception: ', err);
});

