const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

dotenv.config();
const app = express()

const allowedOrigins = ['http://localhost:4000','https://themis-form-wizard.vercel.app/eligibility-editor-legal-clinic-unb']; 

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

//ELIGIBILITY
app.get('/eligibility', async (req, res) => {
  const db = await connectDB();
  const collection = db.collection('eligibility'); 
  const result = await collection.find()
    .sort({ _id: -1 })
    .limit(2)
    .toArray();
  res.json(result);
});

app.post('/eligibility', async (req, res) => {
  try{
    const db = await connectDB();
    const collection = db.collection('eligibility'); 
    // Delete all but latest document
    const recentDocs = await collection.find()
      .sort({ _id: -1 }) 
      .limit(2)
      .toArray();

    const recentIds = recentDocs.map(doc => doc._id);

    await collection.deleteMany({ _id: { $nin: recentIds } });

    const result = await collection.insertOne(req.body);
    res.status(201).json({ insertedId: result.insertedId });
  }
  catch (error) {
    console.error('POST /eligibility error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//INTAKE
app.get('/intake', async (req, res) => {
  const db = await connectDB();
  const collection = db.collection('intake'); 
  const result = await collection.find()
    .sort({  _id: -1 })
    .limit(2)
    .toArray();
  res.json(result);
});

app.post('/intake', async (req, res) => {
  try{
    const db = await connectDB();
    const collection = db.collection('intake'); 
    const recentDocs = await collection.find()
      .sort({ _id: -1 }) 
      .limit(2)
      .toArray();

    const recentIds = recentDocs.map(doc => doc._id);

    await collection.deleteMany({ _id: { $nin: recentIds } });
    const result = await collection.insertOne(req.body);
    res.status(201).json({ insertedId: result.insertedId });
  }
  catch (error) {
    console.error('POST /intake error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// RESOURCES
app.get('/resources', async (req, res) => {
  const db = await connectDB();
  const collection = db.collection('resources'); 
  const result = await collection.find().toArray();
  res.json(result);
});

app.post('/resources', async (req, res) => {
  try{
    const db = await connectDB();
    const collection = db.collection('resources'); 
    const result = await collection.insertOne(req.body);
    res.status(201).json({ insertedId: result.insertedId });
  }
  catch (error) {
    console.error('POST /resources error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));