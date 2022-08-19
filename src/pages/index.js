const fs = require('fs');

module.exports = (req, res) => {
    return new Promise(function (render) {
        render(fs.readFileSync('./src/html/index.html'));
    });
}