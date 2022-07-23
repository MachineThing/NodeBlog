const fs = require('fs');
const { URLSearchParams } = require('url');

module.exports = (req, res) => {
    return new Promise(function (resolve) {
        if (req.method === "POST") {
            var output = "";
    
            req.on('data', function (chunk) {
                output += chunk;
            });
            
            req.on('end', function () {
                const outParams = new URLSearchParams(output);
                resolve(outParams.toString());
            });
        } else {
            resolve(fs.readFileSync('./src/html/register.html'));
        }
    });
}