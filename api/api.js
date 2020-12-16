#!/usr/bin/env node

const express = require('express');
const cors = require('cors');



const PORT = 5002;

const whitelist = ['https://jasonn.dev', 'https://www.jasonn.dev']
const corsOptions = {
  origin: whitelist,
}



const api = express();



function serverlog(req, code) {
    console.log(
        new Date,
        'Request: ' + req.protocol + '://' + req.get('host') + req.originalUrl,
        'Response: (' + code + ')'
    );
}



api.use('*', cors(corsOptions), function(req, res, next) {
    if (whitelist.includes(req.header('Origin'))) {
        next();
    }
    else {
        const res_code = 403;
        serverlog(req, res_code, res_msg);

        const res_msg = 'Forbidden';
        res.status(res_code);

        if(req.accepts('json')) {
            res.json({ error: res_msg });
            return;
        }

        res.type('txt').send(res_msg);
    }
});



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
});



api.listen(PORT);

process.on('SIGINT', function() {
    console.log('\nGracefully shutting down from SIGINT (Ctrl-C)\n');
    contact_db.close();
    process.exit();
});

