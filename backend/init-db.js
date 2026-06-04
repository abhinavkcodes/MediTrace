const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function initDatabase() {
  let connection;

  try {
    // Connect without specifying database first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('Connected to MySQL server');

    // Read and execute schema.sql from project root
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema.sql...');
    await connection.execute(schemaSQL);

    console.log('Database initialized successfully!');

  } catch (error) {
    console.error('Error initializing database:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();