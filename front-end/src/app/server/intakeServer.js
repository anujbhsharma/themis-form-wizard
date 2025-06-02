const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/intake', async (req, res) => {
  const db = await connectDB();
  const result = await db.collection('intake').find().toArray();
  res.json(result);
});

app.post('/intake', async (req, res) => {
  const db = await connectDB();
  const result = await db.collection('intake').insertOne(req.body);
  res.status(201).json({ insertedId: result.insertedId });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
