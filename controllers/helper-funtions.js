const crypto = require('crypto');
const { result } = require('underscore');
const fs = require('fs');

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
    },
    getFilesInDirectory(filesss = '') {
        console.log("\nFiles present in directory:");
        let files =
             fs.readdirSync(`${__dirname}/../public/images/${filesss}`);

        files.forEach(file => {
            console.log(file);
        });
    },
    async deleteFileFromFolder(filepath) {
        return new Promise((resolve, reject) => {
            fs.unlink(`${__dirname}/..${filepath}`, (err) => {
                if(err) {                    
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }
}