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
    logoUrl: "/uploads/logo-09c10f70-f30f-4bcb-8853-dd02197e0173.jpg"
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

// Helper function to fetch current content
async function getCurrentContent() {
  try {
    const { blobs } = await list();
    const contentBlob = blobs.find(blob => blob.pathname === contentKey);
    
    if (contentBlob) {
      const response = await fetch(contentBlob.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.status}`);
      }
      
      return await response.json();
    } else {
      // If no content exists, use default and create it
      await put(contentKey, JSON.stringify(defaultContent), {
        contentType: 'application/json',
        access: 'public',
        allowOverwrite: true
      });
      
      return defaultContent;
    }
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  // Ensure we respond to all methods, even if just to reject them
  const allowedMethods = ['GET', 'POST', 'PATCH'];
  
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
  
  // Handle GET request - return the content
  if (req.method === 'GET') {
    try {
      const content = await getCurrentContent();
      return res.status(200).json(content);
    } catch (error) {
      console.error('Error fetching content:', error);
      return res.status(500).json({ message: 'Error fetching content', error: error.message });
    }
  }
  
  // Handle PATCH request for specific updates (like toggling announcement status)
  if (req.method === 'PATCH') {
    try {
      const { action, secretCode: providedCode } = req.body;
      
      // Verify secret code
      if (providedCode !== secretCode) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      // Fetch current content
      const content = await getCurrentContent();
      
      // Handle toggle announcement action
      if (action === 'toggleAnnouncement') {
        const { announcementId, active } = req.body;
        
        if (!announcementId) {
          return res.status(400).json({ message: 'Announcement ID is required' });
        }
        
        // Find the announcement to update
        const announcementIndex = content.announcements.findIndex(a => a.id === announcementId);
        
        if (announcementIndex === -1) {
          return res.status(404).json({ message: 'Announcement not found' });
        }
        
        // Update the active status
        content.announcements[announcementIndex].active = active;
        
        // Update lastUpdated timestamp
        content.lastUpdated = new Date().toISOString();
        
        // Save the updated content
        await put(contentKey, JSON.stringify(content), {
          contentType: 'application/json',
          access: 'public',
          allowOverwrite: true
        });
        
        return res.status(200).json({ 
          message: 'Announcement updated successfully', 
          announcement: content.announcements[announcementIndex]
        });
      }
      
      // Handle other PATCH actions here if needed
      
      return res.status(400).json({ message: 'Invalid action' });
    } catch (error) {
      console.error('Error updating content:', error);
      return res.status(500).json({ message: 'Error updating content', error: error.message });
    }
  }
  
  // Handle POST request - update the entire content
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
        allowOverwrite: true
      });
      
      return res.status(200).json({ message: 'Content updated successfully', content });
    } catch (error) {
      console.error('Error updating content:', error);
      return res.status(500).json({ message: 'Error updating content', error: error.message });
    }
  }
}