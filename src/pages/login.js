const fs = require('fs');
const crypto = require('crypto');
const { URLSearchParams } = require('url');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = (req, res) => {
    return new Promise(function (render) {
        let inputPassword       = "";
        let inputUsername       = "";

        if (req.method === "POST") {
            var output = "";
    
            req.on('data', function (chunk) {
                output += chunk;
            });

            req.on('end', () => {
                const outParams = new URLSearchParams(output);

                inputPassword   = outParams.get('password');
                inputUsername   = outParams.get('username');

                prisma.$connect().then(async () => {
                    const user = await prisma.user.findFirst({
                        where: {
                            username: inputUsername
                        }
                    });
                    if (user === null) {
                        await prisma.$disconnect();
                        render(`<h1>User doesn't exist.</h1>`);
                    } else {
                        // Get password
                        const userSaltHash = user.password;
                        const userSalt = userSaltHash.slice(0, 32);     // Remember: first 16 bytes is salt (16*2 because hex)
                        const userHash = userSaltHash.slice(32, 128);   // 128 is length

                        const inputSalted = crypto.createHash('sha3-384').update(`${userSalt}${inputPassword}`);

                        if (userHash === inputSalted.digest("hex")) {
                            render(`<h1>Welcome, user!</h1>`);
                        } else {
                            render(`<h1>Wrong password.</h1>`);
                        }
                    }
                });
            });
        } else {
            render(fs.readFileSync('./src/html/login.html'));
        }
    });
}