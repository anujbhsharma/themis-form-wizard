const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Read and parse JSON
const rawData = fs.readFileSync('data.json');
const data = JSON.parse(rawData);

// Open SQLite database (creates file if not exists)
const db = new sqlite3.Database('data.db');

// Create table
const keys = Object.keys(data[0]);
const columns = keys.map(k => `${k} TEXT`).join(', ');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (${columns})`);

  const placeholders = keys.map(() => '?').join(', ');
  const stmt = db.prepare(`INSERT INTO users VALUES (${placeholders})`);

  data.forEach(item => {
    stmt.run(keys.map(k => item[k]));
  });

  stmt.finalize();
});

db.close(() => {
  console.log('JSON data inserted into SQLite database.');
});
