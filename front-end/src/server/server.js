const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/config', async (req, res) => {
  const db = await connectDB();
  const result = await db.collection('config').find().toArray();
  res.json(result);
});

app.post('/config', async (req, res) => {
  const db = await connectDB();
  const result = await db.collection('config').insertOne(req.body);
  res.status(201).json({ insertedId: result.insertedId });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));


// const { MongoClient } = require('mongodb');
// require('dotenv').config();

// const client = new MongoClient(process.env.MONGO_URI);

// async function connectDB() {
//   if (!client.topology || !client.topology.isConnected()) {
//     await client.connect();
//   }
//   return client.db(process.env.DB_NAME);
// }











// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// mongoose.connect('mongodb://localhost:27017/mydatabase', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// const itemSchema = new mongoose.Schema({
//     name: String,
//     description: String,
// });

// const Item = mongoose.model('Item', itemSchema);

// // GET route
// app.get('/items', async (req, res) => {
//     const items = await Item.find();
//     res.json(items);
// });

// // POST route
// app.post('/items', async (req, res) => {
//     const newItem = new Item(req.body);
//     await newItem.save();
//     res.json(newItem);
// });

// app.listen(5000, () => console.log('Server running on port 5000'));

// ⚛️ 2. Frontend Setup (React)

// You can use fetch or axios to connect to the backend.
// a. Install Axios (optional)

// npm install axios

// b. Example App.js Using Fetch

// import React, { useState, useEffect } from 'react';

// function App() {
//   const [items, setItems] = useState([]);
//   const [form, setForm] = useState({ name: '', description: '' });

//   // Fetch items
//   useEffect(() => {
//     fetch('http://localhost:5000/items')
//       .then(res => res.json())
//       .then(data => setItems(data));
//   }, []);

//   // Post new item
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     fetch('http://localhost:5000/items', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(form),
//     })
//       .then(res => res.json())
//       .then(newItem => setItems([...items, newItem]));
//   };

//   return (
//     <div>
//       <h1>Items</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           placeholder="Name"
//           value={form.name}
//           onChange={e => setForm({ ...form, name: e.target.value })}
//         />
//         <input
//           placeholder="Description"
//           value={form.description}
//           onChange={e => setForm({ ...form, description: e.target.value })}
//         />
//         <button type="submit">Add</button>
//       </form>
//       <ul>
//         {items.map(item => (
//           <li key={item._id}>{item.name}: {item.description}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;

