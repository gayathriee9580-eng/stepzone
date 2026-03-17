const bcrypt = require('bcrypt');

async function hashPassword() {
    const hashed = await bcrypt.hash("1234567890", 10);
    console.log(hashed);
}

hashPassword();