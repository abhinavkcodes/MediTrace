const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database/database.db');

db.serialize(() => {
  db.get('SELECT COUNT(*) AS n FROM medicines', (err, row) => {
    console.log('Medicines:', err ? err.message : row.n);
  });

  db.get('SELECT COUNT(*) AS n FROM stores', (err, row) => {
    console.log('Stores:', err ? err.message : row.n);
  });

  db.get('SELECT COUNT(*) AS n FROM inventory', (err, row) => {
    console.log('Inventory rows:', err ? err.message : row.n);
  });

  db.get('SELECT COUNT(*) AS n FROM orders', (err, row) => {
    console.log('Orders:', err ? err.message : row.n);
  });

  db.get('SELECT COUNT(*) AS n FROM order_items', (err, row) => {
    console.log('Order items:', err ? err.message : row.n);
    db.close();
  });
});