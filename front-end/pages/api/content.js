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
// pages/api/content.js
import { list, put } from '@vercel/blob';

// Secret code for admin access
const secretCode = 'your-secret-code-here';
const contentKey = 'content.json';

// Default content
const defaultContent = {
  clinicInfo: {
    name: "Legal Clinic Services",
    aboutText: "Our legal clinic provides quality legal assistance to those who might otherwise be unable to afford legal services.",
    services: [
      "Family law consultations",
      "Landlord-tenant dispute resolution",
      "Immigration assistance",
      "Small claims court representation",
      "Document review and preparation"
    ],
    contactInfo: {
      address: "123 Legal Street, Suite 101",
      phone: "(555) 123-4567",
      email: "info@legalclinic.org",
      hours: "Mon-Fri, 9am-5pm"
    },
    calendlyLink: "https://calendly.com/your-account/your-event",
    logoUrl: "/logo.png"
  },
  announcements: [
    {
      id: "1",
      title: "Holiday Hours",
      content: "Our clinic will be closed on April 15th for staff training.",
      type: "info",
      active: true
    }
  ],
  lastUpdated: new Date().toISOString()
};

export default async function handler(req, res) {
  // Ensure we respond to all methods, even if just to reject them
  const allowedMethods = ['GET', 'POST'];
  
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
  
  // Handle GET request - return the content
  if (req.method === 'GET') {
    try {
      // List blobs to check if content exists
      const { blobs } = await list();
      const contentBlob = blobs.find(blob => blob.pathname === contentKey);
      
      if (contentBlob) {
        // Content exists, fetch it
        const response = await fetch(contentBlob.url);
        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.status}`);
        }
        
        const content = await response.json();
        return res.status(200).json(content);
      } else {
        // Create default content
        const { url } = await put(contentKey, JSON.stringify(defaultContent), {
          contentType: 'application/json',
          access: 'public',
        });
        
        return res.status(200).json(defaultContent);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      return res.status(500).json({ message: 'Error fetching content', error: error.message });
    }
  }
  
  // Handle POST request - update the content
  if (req.method === 'POST') {
    try {
      const { content, secretCode: providedCode } = req.body;
      
      // Verify secret code
      if (providedCode !== secretCode) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      // Validate content structure
      if (!content) {
        return res.status(400).json({ message: 'Invalid content format' });
      }
      
      // Update lastUpdated field
      content.lastUpdated = new Date().toISOString();
      
      // Store content in Blob storage
      const { url } = await put(contentKey, JSON.stringify(content), {
        contentType: 'application/json',
        access: 'public',
      });
      
      return res.status(200).json({ message: 'Content updated successfully', content });
    } catch (error) {
      console.error('Error updating content:', error);
      return res.status(500).json({ message: 'Error updating content', error: error.message });
    }
  }
}