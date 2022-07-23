const fs = require('fs');

module.exports = (req, res) => {
    return fs.readFileSync('./src/html/register.html');
}