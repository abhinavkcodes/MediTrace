const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const DB_DRIVER = process.env.DB_DRIVER || 'mysql'; // Changed default to mysql
const DB_FILE = process.env.DB_FILE || path.join(__dirname, '..', 'database', 'database.db');

let dbClient = null;
let isSQLite = DB_DRIVER === 'sqlite';

if (isSQLite) {
  const sqlite3 = require('sqlite3').verbose();
  const dbPath = path.isAbsolute(DB_FILE) ? DB_FILE : path.join(__dirname, '..', DB_FILE);

  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  dbClient = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error('✗ SQLite Connection Error:', err.message);
      process.exit(1);
    }
    console.log(`✓ SQLite database loaded at ${dbPath}`);
  });

  const all = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      dbClient.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  };

  const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      dbClient.get(sql, params, (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      });
    });
  };

  const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      dbClient.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  };

  const exec = (sql) => {
    return new Promise((resolve, reject) => {
      dbClient.exec(sql, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  };

  module.exports = {
    driver: 'sqlite',
    db: dbClient,
    all,
    get,
    run,
    exec
  };
} else {
  const mysql = require('mysql2/promise');
  dbClient = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'medicine_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  const all = async (sql, params = []) => {
    const [rows] = await dbClient.execute(sql, params);
    return rows;
  };

  const get = async (sql, params = []) => {
    const [rows] = await dbClient.execute(sql, params);
    return rows[0] || null;
  };

  const run = async (sql, params = []) => {
    const [result] = await dbClient.execute(sql, params);
    return { lastID: result.insertId || null, changes: result.affectedRows || 0 };
  };

  module.exports = {
    driver: 'mysql',
    db: dbClient,
    all,
    get,
    run
  };
}
