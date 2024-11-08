const crypto = require('crypto');

module.exports = {
    generatePassword(password) {
        const salt = crypto.randomBytes(32).toString('hex')
        const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
        return salt+'?'+genHash;
        // return {
        //     salt: salt+'?',
        //     hash: genHash
        // }
    },
    validPassword(password, salt, hash ) {
        const checkHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
        return hash === checkHash
    }
    
}