const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

dotenv.config();
const app = express()

const allowedOrigins = [
  'http://localhost:3001/eligibility',
  'http://localhost:3001/intake',
  'http://localhost:4000',
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true); // Allow
    } else {
      callback(new Error('Not allowed by CORS')); // INvalid origins blocked
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
// app.use('/eligibility', require('./routes/route.js'));
// app.use('/intake', require('./routes/route.js'));

app.get('/eligibility', async (req, res) => {
  const db = await connectDB();
  const result = await db.collection('eligibility').find()
    .sort({ createdAt: -1 })
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
    .sort({ createdAt: -1 })
    .limit(1)
    .toArray();
  res.json(result);
});

app.post('/intake', async (req, res) => {
  const db = await connectDB();
  const result = await db.collection('intake').insertOne(req.body);
  res.status(201).json({ insertedId: result.insertedId });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));