const fs = require('fs');
const crypto = require('crypto');
const { URLSearchParams } = require('url');

module.exports = (req, res) => {
    return new Promise(function (resolve) {
        // Checks
        let password_matches    = true;
        let vaild_username      = true;
        let valid_email         = true;

        if (req.method === "POST") {
            var output = "";
    
            req.on('data', function (chunk) {
                output += chunk;
            });
            
            req.on('end', function () {
                const outParams = new URLSearchParams(output);
                // Server-side form validation (if client-side doesn't work or is disabled)
                // Check if the passwords match
                password_matches = outParams.get('password1') === outParams.get('password2');
                // Check if username is valid (alphabet, numbers, dashes and underscores only. 3 to 20 characters long)
                vaild_username = /^[A-Za-z0-9-_]{3,20}$/.test(outParams.get('username'));
                // Check if email matches (credit to: https://github.com/manishsaraan/email-validator/blob/master/index.js)
                valid_email = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/.test(outParams.get('email'));
                if (!password_matches || !vaild_username || !valid_email) {
                    resolve('Error');
                } else {
                    let salt = crypto.randomBytes(16);
                    let user_password = `${salt}${outParams.get('password1')}`
                    let hash = crypto.createHash('sha3-384').update(user_password).digest('hex');
                    let salted_hash = `${salt.toString('hex')}${hash}`
                    resolve(salted_hash);
                }
            });
        } else {
            resolve(fs.readFileSync('./src/html/register.html'));
        }
    });
}