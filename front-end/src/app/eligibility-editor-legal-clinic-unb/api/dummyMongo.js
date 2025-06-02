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

const uri = 'mongodb+srv://themiscore:bxwWDa1uk9XsXlr5@unb-legal-clinic.nosdxtp.mongodb.net/tcdb';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('tcdb'); 
    const collection = db.collection('eligibility'); //6835d3a49389eda801870829
    const result = await collection.insertOne({
    ...data});
    console.log('Document inserted with _id:', result.insertedId);
  } catch (err) {
    console.error('MongoDB error:', err.message);
  } finally {
    await client.close();
  }
}

run();
