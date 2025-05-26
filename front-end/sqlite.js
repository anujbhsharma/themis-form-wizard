const sqlite3 = require("sqlite3").verbose();

let sql;

//connect to DB
const db = new sqlite3.Database("./test.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
});

// //create table :
sql = `CREATE TABLE shelter (name TEXT PRIMARY KEY, name, phoneNumber, email, website)`;
db.run(sql);

// //drop table :
db.run("DROP TABLE users");

// //insert data into table :
sql = `INSERT INTO users (first_name, last_name, username, password, email) VALUES(?,?,?,?,?)`;
db.run(
  sql,
  ["Charity", "Woodstock", "1234567890", "mike@gmail.com", "website.com"],
  (err) => {
    if (err) return console.error(err.message);
  }
);

// //update data :
sql = `UPDATE users SET website = ? WHERE name = ?`;
db.run(sql, ["newwebsite.com", "Charity"], (err) => {
  if (err) return console.error(err.message);
});

// //Delete data :
sql = `DELETE FROM USERS WHERE name = ?`;
db.run(sql, ["Charity"], (err) => {
  if (err) return console.error(err.message);
});

// //querying the data :
sql = `SELECT * FROM users`;
db.all(sql, [], (err, rows) => {
  if (err) return console.error(err.message);
  rows.forEach((row) => {
    console.log(row);
  });
});