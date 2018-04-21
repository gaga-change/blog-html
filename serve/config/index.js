module.exports = {
    MYSQL_HOST: process.env.MYSQL_HOST || 'localhost',
    MYSQL_USER: process.env.MYSQL_USER || 'root',
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || '123456',
    MYSQL_DATABASE: process.env.MYSQL_DATABASE || 'blog',
    MYSQL_PORT: process.env.MYSQL_PORT || '3306',
}