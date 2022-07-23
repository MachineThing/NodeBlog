const http = require('http');
const fs = require('fs');

const mime = require('mime');

const urls = require('./urls.js');
const { restart } = require('nodemon');

const server = http.createServer();

server.on('request', (req, res) => {
    const urlPage = urls[req.url.split('/')[1]];

    if (req.url.split('/')[1] === 'static') {
        // Static file
        const staticName = './src'+req.url;
        res.writeHead(200, { 'Content-Type': mime.getType(staticName) });
        res.end(fs.readFileSync(staticName));
    } else if (urlPage === undefined) {
        // File not found
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('./src/404.html'));
    } else {
        try {
            // In urls.js
            require('./pages' + urlPage)(req, res).then(
                // Success
                function (output) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(output);
                }
            );
        } catch (err) {
            // Server error
            res.writeHead(500, { 'Content-Type': 'text/html' });
            console.warn(err);
            res.end(fs.readFileSync('./src/500.html'));
        }
    }
});

server.listen(8080);