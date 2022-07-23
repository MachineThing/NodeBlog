const http = require('http');
const fs = require('fs');

const urls = require('./urls.js');

const server = http.createServer();

server.on('request', (req, res) => {
    const urlPage = urls[req.url.split('/')[1]];
    var text;

    if (urlPage === undefined) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        text = fs.readFileSync('./src/404.html');
    } else {
        try {
            text = require('./pages' + urlPage)();
            res.writeHead(200, { 'Content-Type': 'text/html' });
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            console.warn(err);
            text = "500";
        }
    }
    res.end(text);
});

server.listen(8080);