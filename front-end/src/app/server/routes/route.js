const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db.js');
require('dotenv').config();

const app = express.Router();
app.use(cors());
app.use(express.json());

// POST to eligibility collection
app.post('/eligibility', async (req, res) => {
  const db = await connectDB();
  const result = await db.collection('eligibility').insertOne({
    ...req.body});
  res.json({ insertedId: result.insertedId });
});

//POST to intake collection
app.post('/intake', async (req, res) => {
  const db = await connectDB();
  const result = await db.collection('intake').insertOne(req.body);
  res.json({ insertedId: result.insertedId });
});

//POST to resource collection
app.post('/resources', async (req, res) => {
  const db = await connectDB();
  const result = await db.collection('resources').insertOne(req.body);
  res.json({ insertedId: result.insertedId });
});


//GET latest eligibility
app.get('/eligibility', async (req, res) => {
  const db = await connectDB();
  const eligibilities = await db.collection('eligibility')
    .find()
    .sort({  _id: -1  })
    .limit(2)
    .toArray();

  res.json(eligibilities[0] || {}); // Return empty object if none found
});

//GET latest intake
app.get('/intake', async (req, res) => {
  const db = await connectDB();
  const intakes = await db.collection('intake').find()
    .sort({  _id: -1  })
    .limit(2)
    .toArray();
  res.json(intakes[0] || {});
});

//GET latest resource
app.get('/resources', async (req, res) => {
  const db = await connectDB();
  const intakes = await db.collection('resources').find().toArray();
  res.json(intakes);
});

module.exports = app; // export router