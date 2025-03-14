require('dotenv').config();
module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    jwtRefresSecret: process.env.JWT_REFRESH_SECRET,
    tokenExpiresIn: '15m',
    refreshExpiresIn: '7d',
    ASSEMBLYAI_API_URL: process.env.ASSEMBLYAI_API_URL,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_ACCESS: process.env.REDIS_ACCESS,
    REDIS_URL: process.env.REDIS_URL
}   