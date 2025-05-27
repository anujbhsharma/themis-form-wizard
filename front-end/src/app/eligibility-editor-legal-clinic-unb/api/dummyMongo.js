const { MongoClient } = require('mongodb');
const fs = require('fs');

// Read and parse the single JSON object
const rawData = fs.readFileSync('dummy.json', 'utf-8');
let data;

try {
  data = JSON.parse(rawData);
} catch (err) {
  console.error('Invalid JSON:', err.message);
  process.exit(1);
}

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('tcdb'); 
    const collection = db.collection('eligibility'); //
    const result = await collection.insertOne(data);
    console.log('Document inserted with _id:', result.insertedId);
  } catch (err) {
    console.error('MongoDB error:', err.message);
  } finally {
    await client.close();
  }
}

run();
