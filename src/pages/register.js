const fs = require('fs');
const crypto = require('crypto');
const { URLSearchParams } = require('url');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = (req, res) => {
    return new Promise(function (render) {
        // Checks
        let password_matches    = true;
        let vaild_username      = true;
        let valid_email         = true;

        // Input

        let input_password       = "";
        let input_username       = "";
        let input_email          = "";

        if (req.method === "POST") {
            var output = "";
    
            req.on('data', function (chunk) {
                output += chunk;
            });
            
            req.on('end', () => {
                const outParams = new URLSearchParams(output);
                // Get input
                input_password   = outParams.get('password1');
                input_username   = outParams.get('username');
                input_email      = outParams.get('email');

                // Server-side form validation (if client-side doesn't work or is disabled)
                // Check if the passwords match
                password_matches = input_password === outParams.get('password2');
                // Check if username is valid (alphabet, numbers, dashes and underscores only. 3 to 20 characters long)
                vaild_username = /^[A-Za-z0-9-_]{3,20}$/.test(input_username);
                // Check if email matches (credit to: https://github.com/manishsaraan/email-validator/blob/master/index.js)
                valid_email = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/.test(input_email);
                
                if (!password_matches || !vaild_username || !valid_email) {
                    // If passwords don't match or the username isn't valid or the email isn't valid then...
                    render('Error');
                } else {
                    // Salt and get hash
                    let salt = crypto.randomBytes(16);                                  // Generate a 16 byte (128 bit [16*8]) salt
                    let user_password = `${salt.toString('hex')}${input_password}`      // Append salt to password
                    let hash = crypto.createHash('sha3-384').update(user_password);     // Hash salted password
                    let salted_hash = `${salt.toString('hex')}${hash.digest('hex')}`;   // Append salt to hash

                    // Put in database
                    prisma.$connect().then(async () => {
                        try {
                            const user = await prisma.user.create({data: {
                                username: input_username,
                                email: input_email,
                                password: salted_hash
                            }});
                            await prisma.$disconnect();
                            render("Success!");
                        } catch (err) {
                            console.error(err);
                            await prisma.$disconnect();
                            render(`Database error: ${err}`);
                        }
                    });
                }
            });
        } else {
            render(fs.readFileSync('./src/html/register.html'));
        }
    });
}