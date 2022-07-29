require('dotenv').config()

const config = {
    database: {
        DATABASE: 'shici',
        USERNAME: 'root',
        PASSWORD: process.env.DATA_BASE_TEST,
        PORT: '3306',
        HOST: 'localhost'
    }
}

module.exports = config