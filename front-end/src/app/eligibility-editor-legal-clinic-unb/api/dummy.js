// const db = new sqlite3.Database('form.db');
 
// // Example JSON object
// const form = {
//   id: "disclaimers",
//   title: "Disclaimers and Consent",
//   icon: "FileText",
//   critical: true,
//   fields: [
// 	{
//   	name: "disclaimer",
//   	label: "Disclaimer",
//   	type: "radio",
//   	required: true,
//   	validation: {
//     	rules: ["disclaimer"]
//   	},
//   	options: [
//     	{ value: "agree", label: "I agree" },
//     	{ value: "disagree", label: "I do not agree" }
//   	]
// 	},
// 	{
//   	name: "email",
//   	label: "Email",
//   	type: "radio",
//   	required: true,
//   	validation: {
//     	rules: ["email"]
//   	},
//   	options: [
//     	{ value: "accept", label: "I accept" },
//     	{ value: "decline", label: "I decline" }
//   	]
// 	}
//   ]
// };
 
// db.serialize(() => {
//   // Create tables
//   db.run(`CREATE TABLE IF NOT EXISTS forms (
// 	id TEXT PRIMARY KEY,
// 	title TEXT,
// 	icon TEXT,
// 	critical BOOLEAN
//   )`);
 
//   db.run(`CREATE TABLE IF NOT EXISTS fields (
// 	id INTEGER PRIMARY KEY AUTOINCREMENT,
// 	form_id TEXT,
// 	name TEXT,
// 	label TEXT,
// 	type TEXT,
// 	required BOOLEAN,
// 	FOREIGN KEY(form_id) REFERENCES forms(id)
//   )`);
 
//   db.run(`CREATE TABLE IF NOT EXISTS validation_rules (
// 	id INTEGER PRIMARY KEY AUTOINCREMENT,
// 	field_id INTEGER,
// 	rule TEXT,
// 	FOREIGN KEY(field_id) REFERENCES fields(id)
//   )`);
 
//   db.run(`CREATE TABLE IF NOT EXISTS options (
// 	id INTEGER PRIMARY KEY AUTOINCREMENT,
// 	field_id INTEGER,
// 	value TEXT,
// 	label TEXT,
// 	FOREIGN KEY(field_id) REFERENCES fields(id)
//   )`);
 
//   // Insert form
//   db.run(`INSERT INTO forms (id, title, icon, critical) VALUES (?, ?, ?, ?)`,
// 	[form.id, form.title, form.icon, form.critical]);
 
//   // Insert fields and related data
//   form.fields.forEach(field => {
// 	db.run(`INSERT INTO fields (form_id, name, label, type, required) VALUES (?, ?, ?, ?, ?)`,
//   	[form.id, field.name, field.label, field.type, field.required],
//   	function (err) {
//     	if (err) throw err;
//     	const fieldId = this.lastID;
 
//     	// Insert validation rules
//     	field.validation?.rules?.forEach(rule => {
//       	db.run(`INSERT INTO validation_rules (field_id, rule) VALUES (?, ?)`,
//         	[fieldId, rule]);
//     	});
 
//     	// Insert options
//     	field.options?.forEach(opt => {
//       	db.run(`INSERT INTO options (field_id, value, label) VALUES (?, ?, ?)`,
//         	[fieldId, opt.value, opt.label]);
//     	});
//   	}
// 	);
//   });
// });
 
// db.close(() => {
//   console.log("Nested JSON successfully imported into SQLite database.");
// });

const sqlite3 = require('sqlite3').verbose();
const db2 = new sqlite3.Database('constants.db');

const data = {
  "CONSTANTS": {
    "INCOME": {
      "MIN_ANNUAL": 0,
      "MAX_ANNUAL": 42000,
      "PER_DEPENDENT": 5000
    },
    "AGE": {
      "MIN": 18,
      "MAX": 120
    },
    "HOUSEHOLD": {
      "MAX_DEPENDENTS": 10,
      "MIN_SIZE": 1,
      "MAX_SIZE": 6
    }
  },
  "MONTHLY_THRESHOLDS": {
    "1": {
      "income": 1900,
      "assets": 5000
    },
    "2": {
      "income": 2800,
      "assets": 9000
    },
    "3": {
      "income": 2900,
      "assets": 10000
    },
    "4": {
      "income": 3100,
      "assets": 11000
    },
    "5": {
      "income": 3300,
      "assets": 12000
    },
    "6": {
      "income": 3500,
      "assets": 13000
    }
  }
};

db2.serialize(() => {
  // Create tables
  db2.run(`CREATE TABLE IF NOT EXISTS constants (
    category TEXT,
    key TEXT,
    value INTEGER
  )`);

  db2.run(`CREATE TABLE IF NOT EXISTS monthly_thresholds (
    household_size INTEGER PRIMARY KEY,
    income INTEGER,
    assets INTEGER
  )`);

  // Insert constants
  for (const [category, values] of Object.entries(data.CONSTANTS)) {
    for (const [key, value] of Object.entries(values)) {
      db.run(`INSERT INTO constants (category, key, value) VALUES (?, ?, ?)`,
        [category, key, value]);
    }
  }

  // Insert monthly thresholds
  for (const [size, values] of Object.entries(data.MONTHLY_THRESHOLDS)) {
    db2.run(`INSERT INTO monthly_thresholds (household_size, income, assets) VALUES (?, ?, ?)`,
      [parseInt(size), values.income, values.assets]);
  }
});

db2.close(() => {
  console.log("JSON constants and thresholds imported into SQLite.");
});