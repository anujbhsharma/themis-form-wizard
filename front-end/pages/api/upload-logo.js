// pages/api/upload-logo.js
import fs from 'fs/promises';
import path from 'path';
import { IncomingForm } from 'formidable';
import { v4 as uuidv4 } from 'uuid';

// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Define base paths relative to project root
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
const DATA_DIR = path.join(process.cwd(), 'src', 'app', 'data'); // Note the src/app path
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');

// Helper to ensure a directory exists
async function ensureDirectoryExists(directory) {
  try {
    await fs.access(directory);
  } catch (error) {
    await fs.mkdir(directory, { recursive: true });
  }
}

export default async function handler(req, res) {
  // The secret code - in a real app, use an environment variable
  const secretCode = 'your-secret-code-here';
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  // Ensure the uploads directory exists before creating the form
  try {
    await ensureDirectoryExists(UPLOADS_DIR);
  } catch (error) {
    console.error('Error creating uploads directory:', error);
    return res.status(500).json({ message: 'Error creating uploads directory' });
  }
  
  // Parse the form data
  const form = new IncomingForm({
    uploadDir: UPLOADS_DIR,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  });
  
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        res.status(500).json({ message: 'Error uploading file' });
        return resolve();
      }
      
      // Verify the secret code
      if (fields.secretCode[0] !== secretCode) {
        res.status(401).json({ message: 'Unauthorized' });
        return resolve();
      }
      
      try {
        const file = files.logo[0];
        
        // Check if it's an image
        if (!file.mimetype.startsWith('image/')) {
          res.status(400).json({ message: 'File must be an image' });
          return resolve();
        }
        
        // Generate a unique filename
        const fileName = `logo-${uuidv4()}${path.extname(file.originalFilename)}`;
        const uploadPath = path.join(UPLOADS_DIR, fileName);
        
        // Move the file from temp location to final location
        await fs.rename(file.filepath, uploadPath);
        
        // Ensure the data directory exists - use the correct path
        await ensureDirectoryExists(DATA_DIR);
        
        // Update the logo URL in the content file
        let content;
        
        try {
          const contentData = await fs.readFile(CONTENT_FILE, 'utf8');
          content = JSON.parse(contentData);
        } catch (error) {
          // If file doesn't exist or is invalid, create new content
          content = {
            clinicInfo: {
              name: "Legal Clinic Services",
              aboutText: "Our legal clinic provides quality legal assistance.",
              services: [],
              contactInfo: {},
              calendlyLink: ""
            },
            announcements: [],
            lastUpdated: new Date().toISOString()
          };
        }
        
        // Make sure clinicInfo exists
        if (!content.clinicInfo) {
          content.clinicInfo = {};
        }
        
        // Update the logo URL
        content.clinicInfo.logoUrl = `/uploads/${fileName}`;
        
        // Save the updated content
        await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf8');
        
        // Return the logo URL
        res.status(200).json({ logoUrl: `/uploads/${fileName}` });
        return resolve();
      } catch (error) {
        console.error('Error handling logo upload:', error);
        res.status(500).json({ message: 'Error processing upload: ' + error.message });
        return resolve();
      }
    });
  });
}