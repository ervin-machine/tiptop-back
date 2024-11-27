require('dotenv').config();
module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    jwtRefresSecret: process.env.JWT_REFRESH_SECRET,
    tokenExpiresIn: '15m',
    refreshExpiresIn: '7d'
}   