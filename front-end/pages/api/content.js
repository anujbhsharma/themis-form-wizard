// // pages/api/content.js
// import fs from 'fs/promises';
// import path from 'path';

// // Define the correct path to the content file - using src/app structure
// const DATA_DIR = path.join(process.cwd(), 'src', 'app', 'data');
// const CONTENT_FILE = path.join(DATA_DIR, 'content.json');

// // Helper to ensure the data directory exists
// async function ensureDataDirectoryExists() {
//   try {
//     await fs.access(DATA_DIR);
//   } catch (error) {
//     // Directory doesn't exist, create it
//     await fs.mkdir(DATA_DIR, { recursive: true });
//   }
// }

// // Helper to read content
// async function readContent() {
//   try {
//     // Make sure the directory exists
//     await ensureDataDirectoryExists();
    
//     // Try to read the content file
//     const contentData = await fs.readFile(CONTENT_FILE, 'utf8');
//     return JSON.parse(contentData);
//   } catch (error) {
//     console.error('Error reading content:', error);
    
//     // If file doesn't exist or is invalid, return default content
//     return {
//       clinicInfo: {
//         name: "Legal Clinic Services",
//         aboutText: "Our legal clinic provides quality legal assistance to those who might otherwise be unable to afford legal services.",
//         services: [
//           "Family law consultations",
//           "Landlord-tenant dispute resolution",
//           "Immigration assistance",
//           "Small claims court representation",
//           "Document review and preparation"
//         ],
//         contactInfo: {
//           address: "123 Legal Street, Suite 101",
//           phone: "(555) 123-4567",
//           email: "info@legalclinic.org",
//           hours: "Mon-Fri, 9am-5pm"
//         },
//         calendlyLink: "https://calendly.com/your-account/your-event",
//         logoUrl: "/logo.png"
//       },
//       announcements: [
//         {
//           id: "1",
//           title: "Holiday Hours",
//           content: "Our clinic will be closed on April 15th for staff training.",
//           type: "info",
//           active: true
//         }
//       ],
//       lastUpdated: new Date().toISOString()
//     };
//   }
// }

// // Helper to write content
// async function writeContent(content) {
//   // Make sure the directory exists
//   await ensureDataDirectoryExists();
  
//   // Update the lastUpdated field
//   content.lastUpdated = new Date().toISOString();
  
//   // Ensure the content has all the required properties
//   if (!content.clinicInfo) {
//     content.clinicInfo = {};
//   }
  
//   if (!content.announcements) {
//     content.announcements = [];
//   }
  
//   // Write the content to the file
//   await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf8');
//   return content;
// }

// export default async function handler(req, res) {
//   // The secret code - in a real app, use an environment variable
//   const secretCode = 'your-secret-code-here';
  
//   // Handle GET request - return the content
//   if (req.method === 'GET') {
//     try {
//       const content = await readContent();
//       console.log('Content read successfully');
//       return res.status(200).json(content);
//     } catch (error) {
//       console.error('Error reading content:', error);
//       return res.status(500).json({ message: 'Error reading content' });
//     }
//   }
  
//   // Handle POST request - update the content
//   if (req.method === 'POST') {
//     try {
//       const { content, secretCode: providedCode } = req.body;
      
//       // Verify the secret code
//       if (providedCode !== secretCode) {
//         return res.status(401).json({ message: 'Unauthorized' });
//       }
      
//       // Validate the content structure
//       if (!content) {
//         return res.status(400).json({ message: 'Invalid content format' });
//       }
      
//       // Write the updated content
//       const updatedContent = await writeContent(content);
//       return res.status(200).json(updatedContent);
//     } catch (error) {
//       console.error('Error updating content:', error);
//       return res.status(500).json({ message: 'Error updating content' });
//     }
//   }
  
//   // Return 405 for any other HTTP method
//   return res.status(405).json({ message: 'Method not allowed' });
// }
// pages/api/upload-logo.js
import { IncomingForm } from 'formidable';
import { put, list } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';

// Disable the default body parser to handle form data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Secret code for admin access
const secretCode = 'your-secret-code-here';
const contentKey = 'content.json';

// Parse form helper
const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Parse the form data
    const { fields, files } = await parseForm(req);
    
    // Verify secret code
    if (fields.secretCode !== secretCode) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Get the logo file
    const logoFile = files.logo;
    if (!logoFile) {
      return res.status(400).json({ message: 'No logo file provided' });
    }
    
    // Read the file
    const fileData = await fs.readFile(logoFile.filepath);
    
    // Create a unique filename with proper extension
    const timestamp = Date.now();
    const extension = path.extname(logoFile.originalFilename || '.png');
    const filename = `logo-${timestamp}${extension}`;
    
    // Upload to Vercel Blob
    const { url } = await put(filename, fileData, {
      contentType: logoFile.mimetype || 'image/png',
      access: 'public',
    });
    
    // Update the content with the new logo URL
    try {
      // List blobs to find content
      const { blobs } = await list();
      const contentBlob = blobs.find(blob => blob.pathname === contentKey);
      
      if (contentBlob) {
        // Fetch the content
        const response = await fetch(contentBlob.url);
        if (response.ok) {
          const content = await response.json();
          
          // Ensure clinicInfo exists
          if (!content.clinicInfo) {
            content.clinicInfo = {};
          }
          
          // Update with new logo URL
          content.clinicInfo.logoUrl = url;
          
          // Save updated content
          await put(contentKey, JSON.stringify(content), {
            contentType: 'application/json',
            access: 'public',
          });
        }
      }
    } catch (contentError) {
      console.error('Error updating content with logo URL:', contentError);
      // Continue anyway since we still uploaded the logo
    }
    
    return res.status(200).json({
      message: 'Logo uploaded successfully',
      logoUrl: url
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    return res.status(500).json({ message: 'Error uploading logo', error: error.message });
  }
}