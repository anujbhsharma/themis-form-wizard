const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

dotenv.config();
const app = express()

const allowedOrigins = ['http://localhost:4000']; 

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); //for curl
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS')); 
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/eligibility', require('./routes/route.js'));
app.use('/intake', require('./routes/route.js'));

app.get('/eligibility', async (req, res) => {
  const db = await connectDB();
  const result = await db.collection('eligibility').find()
    .sort({ _id: -1 })
    .limit(1)
    .toArray();
  res.json(result);
});

app.post('/eligibility', async (req, res) => {
  try{
    const db = await connectDB();
    const result = await db.collection('eligibility').insertOne(req.body);
    res.status(201).json({ insertedId: result.insertedId });
  }
  catch (error) {
    console.error('POST /eligibility error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/intake', async (req, res) => {
  const db = await connectDB();
  const result = await db.collection('intake').find()
    .sort({  _id: -1 })
    .limit(1)
    .toArray();
  res.json(result);
});

app.post('/intake', async (req, res) => {
  try{
    const db = await connectDB();
    const result = await db.collection('intake').insertOne(req.body);
    res.status(201).json({ insertedId: result.insertedId });
  }
  catch (error) {
    console.error('POST /intake error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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

