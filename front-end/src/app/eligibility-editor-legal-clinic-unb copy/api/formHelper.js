import clientPromise from '../../../lib/mongodb.js'

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)
  const collection = db.collection('eligibility')

  if (req.method === 'GET') {
    const eligibility = await collection.find({}).toArray()
    return res.status(200).json(eligibility)
  }

  if (req.method === 'POST') {
    const { name } = req.body
    if (!name) return res.status(400).json({ error: 'Missing  field' })

    const result = await collection.insertOne({ name })
    return res.status(201).json({ insertedId: result.insertedId })
  }

  res.status(405).json({ error: 'Method Not Allowed' })
}