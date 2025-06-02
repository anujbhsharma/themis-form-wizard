const express = require('express');
const cors = require('cors');
const connectDB = require('../server/config/db.js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

/**
 * POST to eligibility collection
 */
app.post('/eligibility', async (req, res) => {
  const db = await connectDB();
  const result = await db.collection('eligibility').insertOne(req.body);
  res.json({ insertedId: result.insertedId });
});

/**
 * POST to users collection
 */
app.post('/intake', async (req, res) => {
  const db = await connectDB();
  const result = await db.collection('intake').insertOne(req.body);
  res.json({ insertedId: result.insertedId });
});

/**
 * GET all eligibility
 */
app.get('/eligibility', async (req, res) => {
  const db = await connectDB();
  const eligibilities = await db.collection('eligibility').find().toArray();
  res.json(eligibilities);
});

/**
 * GET all intake
 */
app.get('/intake', async (req, res) => {
  const db = await connectDB();
  const intakes = await db.collection('intake').find().toArray();
  res.json(intakes);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});