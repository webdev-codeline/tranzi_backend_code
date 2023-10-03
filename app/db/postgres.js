const { Pool } = require('pg');

const pgPool = new Pool({
    user: process.env.DB_USER || 'user',
    host: process.env.DB_HOST || 'db',
    database: process.env.DB_NAME || 'citypopulations',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

module.exports = { pgPool };