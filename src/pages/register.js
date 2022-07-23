const fs = require('fs');
const { URLSearchParams } = require('url');

module.exports = (req, res) => {
    if (req.method === "POST") {
        var output = "";

        req.on('data', function (chunk) {
            output += chunk;
        });
        
        req.on('end', function () {
            const outParams = new URLSearchParams(output);
            console.log(outParams);
        });
    } else {
        return fs.readFileSync('./src/html/register.html');
    }
}