// intake-editor/formHelperMongo.js
// Document inserted with _id: new ObjectId('6835c7ff80cbf3bc8a2d714e')
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

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

// POST: Add form data
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

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// const express = require('express');
// const { MongoClient } = require('mongodb');

// const app = express();
// const port = 4000;

// // Middleware to parse JSON body
// app.use(express.json());

// // MongoDB connection URI
// const uri = "mongodb://localhost:27017";
// const dbName = "tcDatabase";
// const collectionName = "tcCollection";

// // Create MongoDB client
// const client = new MongoClient(uri);

// // Connect to MongoDB once at server start
// let collection;
// client.connect()
//   .then(() => {
//     console.log("Connected to MongoDB");
//     const db = client.db(dbName);
//     collection = db.collection(collectionName);
//   })
//   .catch(err => console.error("MongoDB connection error:", err));

// /**
//  * POST /data
//  * Insert a new document into the eligibility form
//  */
// app.post('/api/eligibility', async (req, res) => {
//   try {
//     const result = await collection.insertOne(req.body);
//     res.status(201).json({ message: 'Document inserted', id: result.insertedId });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to insert document', details: error });
//   }
// });

// /**
//  * GET /data
//  * Fetch all documents from the collection
//  */
// app.get('/api/eligibility', async (req, res) => {
//   try {
//     const docs = await collection.find({}).toArray();
//     res.status(200).json(docs);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch documents', details: error });
//   }
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });