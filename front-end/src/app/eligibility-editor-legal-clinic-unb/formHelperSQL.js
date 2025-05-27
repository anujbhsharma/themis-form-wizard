const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Enable JSON parsing for request bodies
app.use(express.json());

// Connect to the database
const db = new sqlite3.Database('./form.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

// GET request to retrieve data
app.get('/data', (req, res) => {
  const sql = 'SELECT * FROM mytable';

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).send({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    });
  });
});

// POST request to insert data
app.post('/data', (req, res) => {
  const data = req.body;
  const sql = 'INSERT INTO mytable (column1, column2) VALUES (?, ?)';

  db.run(sql, [data.column1, data.column2], function(err) {
    if (err) {
      res.status(400).send({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": data,
      "id": this.lastID // ID of the last inserted row
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});