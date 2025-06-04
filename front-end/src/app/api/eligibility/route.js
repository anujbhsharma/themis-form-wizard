// src/app/api/form/route.js
// import { NextResponse } from 'next/server';
// import fs from 'fs/promises';
// import path from 'path';

// // Get the absolute path to your JSON file

// const FILE_PATH = path.join(process.cwd(), 'src', 'app', 'eligibility-editor-legal-clinic-unb', 'api', 'dummy.json');


// export async function GET() {
//   try {
//   //  console.log('Reading from:', FILE_PATH);
//   //  console.log('Raw JSON:', data);
//     const data = await fs.readFile(FILE_PATH, 'utf8');
//     return NextResponse.json(JSON.parse(data));
//   } catch (error) {
//     console.error('Error reading form data:', error);
//     return NextResponse.json(
//       { error: 'Failed to read form data' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request) {
//   try {
//     // console.log('Reading from:', FILE_PATH);
//     // console.log('Raw JSON:', data);
//     const data = await request.json();
//     console.log('Saving to:', FILE_PATH);
//     console.log('Data to save:', data);

//     await fs.writeFile(
//       FILE_PATH, 
//       JSON.stringify(data, null, 2),
//       'utf8'
//     );

//     return NextResponse.json({ success: true, message: 'Form data saved successfully' });
//   } catch (error) {
//     console.error('Error saving form data (MEOW):', error);
//     return NextResponse.json(
//       { error: 'Failed to save form data' },
//       { status: 500 }
//     );
//   }
// }




// /src/app/api/eligibility/route.js
import clientPromise from '@/lib/mongodb';

export async function POST(req) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('eligibility'); 
    // Delete all but latest document
    const recentDocs = await collection.find()
      .sort({ _id: -1 }) 
      .limit(3)
      .toArray();

    const recentIds = recentDocs.map(doc => doc._id);

    await collection.deleteMany({ _id: { $nin: recentIds } });

    const result = await collection.insertOne(body);
    return new Response(JSON.stringify({ success: true, id: result.insertedId }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to insert data' }), { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await db.collection('eligibility').find().sort({ _id: -1}).limit(2).toArray();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), { status: 500 });
  }
}
