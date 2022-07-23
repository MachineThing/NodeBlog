const fs = require('fs');

module.exports = (req, res) => {
    return fs.readFileSync('./src/html/index.html');
}