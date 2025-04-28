// pages/api/upload-logo.js
import fs from 'fs/promises';
import path from 'path';
import { IncomingForm } from 'formidable';
import { v4 as uuidv4 } from 'uuid';
import { list, put } from '@vercel/blob';

// Content key for Vercel Blob
const contentKey = 'content.json';

// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Define base paths relative to project root
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');

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
      const providedCode = Array.isArray(fields.secretCode) 
        ? fields.secretCode[0] 
        : fields.secretCode;
        
      if (providedCode !== secretCode) {
        res.status(401).json({ message: 'Unauthorized' });
        return resolve();
      }
      
      try {
        const file = Array.isArray(files.logo) ? files.logo[0] : files.logo;
        
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
        
        // Update the logo URL in the content stored in Vercel Blob
        let content;
        
        try {
          // Get content from Vercel Blob
          const { blobs } = await list();
          const contentBlob = blobs.find(blob => blob.pathname === contentKey);
          
          if (contentBlob) {
            // Content exists, fetch it
            const response = await fetch(contentBlob.url);
            if (!response.ok) {
              throw new Error(`Failed to fetch content: ${response.status}`);
            }
            
            content = await response.json();
          } else {
            // Create default content
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
        } catch (error) {
          console.error('Error fetching content:', error);
          // If there's an error, create new content
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
        
        // Update lastUpdated timestamp
        content.lastUpdated = new Date().toISOString();
        
        // Save the updated content to Vercel Blob with allowOverwrite option
        await put(contentKey, JSON.stringify(content), {
          contentType: 'application/json',
          access: 'public',
          allowOverwrite: true // Added allowOverwrite option
        });
        
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