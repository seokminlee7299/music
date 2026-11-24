const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'musicid',
  password: process.env.DB_PASSWORD || 'musicpw',
  database: process.env.DB_NAME || 'musicdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
