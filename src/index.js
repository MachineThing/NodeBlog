const http = require('http');
const fs = require('fs');

const mime = require('mime');

const urls = require('./urls.js');

const server = http.createServer();

server.on('request', (req, res) => {
    const urlPage = urls[req.url.split('/')[1]];
    var text;

    if (req.url.split('/')[1] === 'static') {
        // Static file
        const staticName = './src'+req.url;
        text = fs.readFileSync(staticName);
        res.writeHead(200, { 'Content-Type': mime.getType(staticName) });
    } else if (urlPage === undefined) {
        // File not found
        res.writeHead(404, { 'Content-Type': 'text/html' });
        text = fs.readFileSync('./src/404.html');
    } else {
        try {
            // In urls.js
            text = require('./pages' + urlPage)(req, res);
            res.writeHead(200, { 'Content-Type': 'text/html' });
        } catch (err) {
            // Server error
            res.writeHead(500, { 'Content-Type': 'text/html' });
            console.warn(err);
            text = fs.readFileSync('./src/500.html');
        }
    }
    res.end(text);
});

server.listen(8080);