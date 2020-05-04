const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    uri: 'mongodb://localhost:27017/MEAN-Project-O-Users', 
    secret: crypto, 
    db: 'MEAN-Project-O-Users'
}