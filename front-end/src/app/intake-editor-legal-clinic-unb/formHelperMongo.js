// intake-editor/formHelperMongo.js
// Document inserted with _id: new ObjectId('6835c7ff80cbf3bc8a2d714e')
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json()); // for parsing JSON bodies

const uri = 'mongodb+srv://themiscore:bxwWDa1uk9XsXlr5@unb-legal-clinic.nosdxtp.mongodb.net/tcdb';
const client = new MongoClient(uri);
const dbName = 'tcdb';

async function getDb() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db(dbName);
}

// POST: Add form data by replacing current form
app.post('/intake', async (req, res) => {
  try {
    const db = await getDb();
    const result = await db.collection('intake').insertOne(req.body);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch form
app.get('/intake', async (req, res) => {
  try {
    const db = await getDb();
    const cursor = db.collection('intake').find();
    const documents = await cursor.toArray();
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));