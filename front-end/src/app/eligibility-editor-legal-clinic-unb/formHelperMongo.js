// intake-editor/formHelperMongo.js
// Document inserted with _id: new ObjectId('6835c7ff80cbf3bc8a2d714e')
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');

const app = express();
app.use(express.json()); // for parsing JSON bodies

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'tcdb';

async function getDb() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db(dbName);
}

export async function saveFormData(formData) {
  try {} catch{}}
// POST: Add form data by replacing current form
app.post('/eligibility', async (req, res) => {
  try {
    const db = await getDb();
    const result = await db.collection('eligibility').insertOne(req.body);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch form
app.get('/eligibility', async (req, res) => {
  try {
    const db = await getDb();
    const cursor = db.collection('eligibility').find();
    const documents = await cursor.toArray();
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));