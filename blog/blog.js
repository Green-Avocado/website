#!/usr/bin/env node

const ejs = require('ejs');
const express = require('express');
const fetch = require('node-fetch');
const helmet = require('helmet');
const nocache = require('nocache');
const path = require('path');
const showdown = require('showdown');
const yargs = require('yargs');

const PORT = 5020;

const app = express();
const converter = new showdown.Converter();

const github_prefix = 'https://raw.githubusercontent.com/Green-Avocado/CTF/master';
const href_regex = new RegExp('href="./', 'g')

app.set('view engine', 'ejs');

converter.setOption('simplifiedAutoLink', true);
converter.setOption('excludeTrailingPunctuationFromURLs', true);

function serverlog(req, code) {
    console.log(
        new Date,
        'Request: ' + req.protocol + '://' + req.get('host') + req.originalUrl,
        'Response: (' + code + ')'
    );
}

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                "form-action": ["'self'"],
                "script-src": [
                    "'self'",
                    "ajax.googleapis.com",
                    "cdnjs.cloudflare.com",
                    "maxcdn.bootstrapcdn.com"
                ],
                "style-src": [
                    "'self'",
                    "maxcdn.bootstrapcdn.com"
                ],
            },
        },
    })
);

app.use(nocache());

app.get('/', function(req, res) {
    serverlog(req, 200);

    res.render('pages/index');
    return;
});

app.get('/dev', function(req, res) {
    serverlog(req, 200);

    res.render('pages/dev/index');
    return;
});

app.get('/ctf', async function(req, res, next) {
    let github_url = path.normalize(
        '/README.md'
    );
    let markdown_res = await fetch(github_prefix + github_url);

    if(markdown_res.ok) {
        let markdown_text = await markdown_res.text();
        let markdown_html = converter.makeHtml(markdown_text)
            .replace(href_regex, `href="${req.originalUrl}/`);

        serverlog(req, 200);
        res.render('pages/ctf/readme', {readme_html: markdown_html});
        return;
    }
    else {
        next();
    }
});

app.get('/ctf/:ctf_event', async function(req, res, next) {
    let github_url = path.normalize(
        `/${req.params.ctf_event}` +
        '/README.md'
    );
    let markdown_res = await fetch(github_prefix + github_url);

    if(markdown_res.ok) {
        let markdown_text = await markdown_res.text();
        let markdown_html = converter.makeHtml(markdown_text)
            .replace(href_regex, `href="${req.originalUrl}/`);

        serverlog(req, 200);
        res.render('pages/ctf/readme', {readme_html: markdown_html});
        return;
    }
    else {
        next();
    }
});

app.get('/ctf/:ctf_event/:ctf_type/:ctf_chal', async function(req, res, next) {
    let github_url = path.normalize(
        `/${req.params.ctf_event}` +
        `/${req.params.ctf_type}` +
        `/${req.params.ctf_chal}` +
        '/README.md'
    );
    let markdown_res = await fetch(github_prefix + github_url);

    if(markdown_res.ok) {
        let markdown_text = await markdown_res.text();
        let markdown_html = converter.makeHtml(markdown_text)
            .replace(href_regex, `href="${req.originalUrl}/`);

        serverlog(req, 200);
        res.render('pages/ctf/readme', {readme_html: markdown_html});
        return;
    }
    else {
        next();
    }
});

app.get('/ctf/:ctf_event/:ctf_type/:ctf_chal/resources/:ctf_asset', async function(req, res, next) {
    let github_url = path.normalize(
        `/${req.params.ctf_event}` +
        `/${req.params.ctf_type}` +
        `/${req.params.ctf_chal}` +
        '/resources' +
        `/${req.params.ctf_asset}`
    );
    let asset_res = await fetch(github_prefix + github_url);

    if(asset_res.ok) {
        let asset_data = await asset_res.buffer();

        serverlog(req, 200);
        res.status(200).send(asset_data);
        return;
    }
    else {
        next();
    }
});

app.get('/favicon.ico', function(req, res) {
    res.sendFile('./resources/favicon.ico', { root: __dirname })
    return;
});

app.get('/robots.txt', function(req, res) {
    res.sendFile('./resources/robots.txt', { root: __dirname })
    return;
});

app.use('/resources', express.static(__dirname + '/resources'));

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
    return;
});

app.listen(PORT);

process.on('SIGINT', function() {
    console.log('\nGracefully shutting down from SIGINT (Ctrl-C)\n');
    process.exit();
});

