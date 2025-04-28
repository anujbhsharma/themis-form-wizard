// pages/api/upload-logo.js
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

// Default content structure (matches the one in content.js)
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
    calendlyLink: "https://calendly.com/your-account/your-event"
  },
  announcements: [],
  lastUpdated: new Date().toISOString()
};

// Helper function to get current content
async function getCurrentContent() {
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
      
      return await response.json();
    } else {
      // No content exists yet, return the default
      return { ...defaultContent };
    }
  } catch (error) {
    console.error('Error retrieving content:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  // The secret code - in a real app, use an environment variable
  const secretCode = 'your-secret-code-here';
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  // Parse the form data (in memory, not on filesystem)
  const form = new IncomingForm({
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    multiples: false,
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
        // Check if logo file exists
        const file = Array.isArray(files.logo) ? files.logo[0] : files.logo;
        
        if (!file) {
          res.status(400).json({ message: 'No logo file provided' });
          return resolve();
        }
        
        // Check if it's an image
        if (!file.mimetype.startsWith('image/')) {
          res.status(400).json({ message: 'File must be an image' });
          return resolve();
        }
        
        // Generate a unique filename for Vercel Blob
        const fileName = `logo-${uuidv4()}${file.originalFilename.substring(file.originalFilename.lastIndexOf('.'))}`;
        
        // Read the file content
        const fileBuffer = await require('fs').promises.readFile(file.filepath);
        
        // Upload the logo to Vercel Blob
        let uploadedUrl;
        try {
          const result = await put(fileName, fileBuffer, {
            contentType: file.mimetype,
            access: 'public',
          });
          uploadedUrl = result.url;
        } catch (uploadError) {
          console.error('Error uploading to Vercel Blob:', uploadError);
          res.status(500).json({ message: 'Error uploading logo: ' + uploadError.message });
          return resolve();
        }
        
        // Get the current content (or default if it doesn't exist)
        let content;
        try {
          content = await getCurrentContent();
        } catch (contentError) {
          console.error('Error retrieving content for logo update:', contentError);
          res.status(500).json({ message: 'Error retrieving content for logo update: ' + contentError.message });
          return resolve();
        }
        
        // Make sure clinicInfo exists
        if (!content.clinicInfo) {
          content.clinicInfo = { ...defaultContent.clinicInfo };
        }
        
        // Update the logo URL
        content.clinicInfo.logoUrl = uploadedUrl;
        
        // Update lastUpdated timestamp
        content.lastUpdated = new Date().toISOString();
        
        try {
          // Save the updated content to Vercel Blob
          await put(contentKey, JSON.stringify(content), {
            contentType: 'application/json',
            access: 'public',
            allowOverwrite: true
          });
          
          // Return the logo URL
          res.status(200).json({ logoUrl: uploadedUrl });
          return resolve();
        } catch (saveError) {
          console.error('Error saving updated content with logo:', saveError);
          res.status(500).json({ message: 'Error saving updated content: ' + saveError.message });
          return resolve();
        }
      } catch (error) {
        console.error('Error handling logo upload:', error);
        res.status(500).json({ message: 'Error processing upload: ' + error.message });
        return resolve();
      }
    });
  });
}