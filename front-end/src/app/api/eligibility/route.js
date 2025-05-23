// src/app/api/form/route.js
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Get the absolute path to your JSON file

const FILE_PATH = path.join(process.cwd(), 'src', 'app', 'eligibility-editor-legal-clinic-unb', 'api', 'dummy.json');


export async function GET() {
  try {
    console.log('Reading from:', FILE_PATH);
    console.log('Raw JSON:', data);
    const data = await fs.readFile(FILE_PATH, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading form data:', error);
    return NextResponse.json(
      { error: 'Failed to read form data' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    console.log('Reading from:', FILE_PATH);
    console.log('Raw JSON:', data);
    const data = await request.json();
    // console.log('Saving to:', FILE_PATH);
    // console.log('Data to save:', data);

    await fs.writeFile(
      FILE_PATH, 
      JSON.stringify(data, null, 2),
      'utf8'
    );

    return NextResponse.json({ success: true, message: 'Form data saved successfully' });
  } catch (error) {
    console.error('Error saving form data:', error);
    return NextResponse.json(
      // { error: 'Failed to save form data' },
      // { status: 500 }
    );
  }
}