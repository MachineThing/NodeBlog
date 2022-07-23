const fs = require('fs');

module.exports = (req, res) => {
    return new Promise(function (resolve) {
        resolve(fs.readFileSync('./src/html/index.html'));
    });
}