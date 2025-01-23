// // services/driveService.js

// //1S9XNa0jY4eoupaF5KRyJ728_MdVNJTzy
// // services/driveService.js
// const { google } = require('googleapis');
// const path = require('path');
// const fs = require('fs');
// const fsPromises = require('fs').promises;
// const createCsvWriter = require('csv-writer').createObjectCsvWriter;
// const csv = require('csv-parser');
// const os = require('os');

// class DriveService {
//   constructor() {
//     this.drive = null;
//     this.SCOPES = ['https://www.googleapis.com/auth/drive.file'];
//     this.submissionsCsvId = null;
//     this.parentFolderId = "1S9XNa0jY4eoupaF5KRyJ728_MdVNJTzy";
//     this.tempDir = path.join(os.tmpdir(), 'submissions-temp');
//     this.baseHeaders = [
//       { id: 'id', title: 'Submission ID' },
//       { id: 'type', title: 'Submission Type' },
//       { id: 'timestamp', title: 'Timestamp' },
//       { id: 'folderId', title: 'Folder ID' },
//       { id: 'folderLink', title: 'Folder Link' }
//     ];
//   }

//   async initialize() {
//     try {
//       const auth = new google.auth.GoogleAuth({
//         keyFile: path.join(__dirname, '..', 'credentials', 'google-credentials.json'),
//         scopes: this.SCOPES
//       });

//       this.drive = google.drive({ version: 'v3', auth });
//       await fsPromises.mkdir(this.tempDir, { recursive: true });

//       if (!this.parentFolderId) {
//         console.error('Parent folder ID not configured');
//         throw new Error('Parent folder ID not configured');
//       }

//       await this.initializeCsvFiles();
//       console.log('Drive service initialized successfully');
//     } catch (error) {
//       console.error('Failed to initialize drive service:', error);
//       throw error;
//     }
//   }

//   async getExistingHeaders(csvPath) {
//     return new Promise((resolve, reject) => {
//       const headers = new Set();
//       if (!fs.existsSync(csvPath)) {
//         resolve(this.baseHeaders.map(h => h.title));
//         return;
//       }
//       fs.createReadStream(csvPath)
//         .pipe(csv())
//         .on('headers', (columnHeaders) => {
//           columnHeaders.forEach(header => headers.add(header));
//         })
//         .on('end', () => resolve(Array.from(headers)))
//         .on('error', (error) => {
//           console.error('Error reading headers:', error);
//           resolve(this.baseHeaders.map(h => h.title));
//         });
//     });
//   }

//   async initializeCsvFiles() {
//     try {
//       const submissionsCsv = await this.findFile('form_submissions.csv');
//       if (!submissionsCsv) {
//         this.submissionsCsvId = await this.createCsv('form_submissions.csv', this.baseHeaders);
//         console.log('Created new submissions CSV with ID:', this.submissionsCsvId);
//       } else {
//         this.submissionsCsvId = submissionsCsv.id;
//         console.log('Found existing submissions CSV with ID:', this.submissionsCsvId);
//       }
//     } catch (error) {
//       console.error('Error initializing CSV files:', error);
//       throw error;
//     }
//   }

//   async findFile(fileName) {
//     try {
//       const response = await this.drive.files.list({
//         q: `name = '${fileName}' and '${this.parentFolderId}' in parents and trashed = false`,
//         fields: 'files(id, name, webViewLink)',
//         spaces: 'drive'
//       });
//       return response.data.files[0];
//     } catch (error) {
//       console.error('Error finding file:', error);
//       return null;
//     }
//   }

//   async createCsv(fileName, headers) {
//     try {
//       const tempFilePath = path.join(this.tempDir, fileName);
//       const csvWriter = createCsvWriter({
//         path: tempFilePath,
//         header: headers
//       });
//       await csvWriter.writeRecords([]);

//       const fileMetadata = {
//         name: fileName,
//         parents: [this.parentFolderId],
//         mimeType: 'text/csv'
//       };

//       const media = {
//         mimeType: 'text/csv',
//         body: fs.createReadStream(tempFilePath)
//       };

//       const file = await this.drive.files.create({
//         resource: fileMetadata,
//         media: media,
//         fields: 'id, webViewLink'
//       });

//       await fsPromises.unlink(tempFilePath);
//       console.log('Created CSV file. Link:', file.data.webViewLink);
//       return file.data.id;
//     } catch (error) {
//       console.error('Error creating CSV:', error);
//       throw error;
//     }
//   }

//   async appendToCsv(csvId, records) {
//     try {
//       const tempFilePath = path.join(this.tempDir, `temp_${csvId}.csv`);
//       await this.downloadFile(csvId, tempFilePath);

//       // Get existing headers and records
//       const existingHeaders = await this.getExistingHeaders(tempFilePath);
//       const existingRecords = [];
      
//       if (fs.existsSync(tempFilePath)) {
//         await new Promise((resolve, reject) => {
//           fs.createReadStream(tempFilePath)
//             .pipe(csv())
//             .on('data', (row) => existingRecords.push(row))
//             .on('end', resolve)
//             .on('error', reject);
//         });
//       }

//       // Process new records and collect all unique fields
//       const formattedRecords = records.map(record => {
//         const formData = typeof record.formData === 'string' ? 
//           JSON.parse(record.formData) : record.formData;
        
//         const files = typeof record.files === 'string' ? 
//           JSON.parse(record.files) : record.files;

//         // Extract all fields from formData
//         const flattenedData = this.flattenObject(formData);
        
//         return {
//           id: record.id,
//           type: record.type,
//           timestamp: record.timestamp,
//           folderId: record.folderId || '',
//           folderLink: record.folderLink || '',
//           ...flattenedData,
//           files: JSON.stringify(files)
//         };
//       });

//       // Get all unique headers from existing and new records
//       const allHeaders = new Set(existingHeaders);
//       formattedRecords.forEach(record => {
//         Object.keys(record).forEach(key => allHeaders.add(key));
//       });

//       // Create header objects for CSV writer
//       const headerObjects = Array.from(allHeaders).map(header => ({
//         id: header,
//         title: header
//       }));

//       // Create new CSV writer with all headers
//       const csvWriter = createCsvWriter({
//         path: tempFilePath,
//         header: headerObjects
//       });

//       // Write all records
//       await csvWriter.writeRecords([...existingRecords, ...formattedRecords]);
//       await this.updateFile(csvId, tempFilePath);
//       await fsPromises.unlink(tempFilePath);
      
//       console.log('Successfully appended records to CSV');
//     } catch (error) {
//       console.error('Error appending to CSV:', error);
//       throw error;
//     }
//   }

//   flattenObject(obj, prefix = '') {
//     const flattened = {};
    
//     for (const key in obj) {
//       if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
//         Object.assign(flattened, this.flattenObject(obj[key], `${prefix}${key}_`));
//       } else {
//         flattened[`${prefix}${key}`] = Array.isArray(obj[key]) || typeof obj[key] === 'object' ? 
//           JSON.stringify(obj[key]) : obj[key];
//       }
//     }
    
//     return flattened;
//   }
//   async createRootFolder() {
//     try {
//       const folderMetadata = {
//         name: 'Form Submissions Root',
//         mimeType: 'application/vnd.google-apps.folder'
//       };

//       const folder = await this.drive.files.create({
//         resource: folderMetadata,
//         fields: 'id, webViewLink'
//       });

//       console.log('Created root folder. ID:', folder.data.id);
//       console.log('Root folder link:', folder.data.webViewLink);
      
//       return {
//         id: folder.data.id,
//         link: folder.data.webViewLink
//       };
//     } catch (error) {
//       console.error('Error creating root folder:', error);
//       throw error;
//     }
//   }

//   async initializeCsvFiles() {
//     try {
//       // Look for existing submissions CSV
//       const submissionsCsv = await this.findFile('form_submissions.csv');
      
//       if (!submissionsCsv) {
//         // Create new CSV if doesn't exist
//         this.submissionsCsvId = await this.createCsv('form_submissions.csv', this.headers);
//         console.log('Created new submissions CSV with ID:', this.submissionsCsvId);
//       } else {
//         this.submissionsCsvId = submissionsCsv.id;
//         console.log('Found existing submissions CSV with ID:', this.submissionsCsvId);
//       }
//     } catch (error) {
//       console.error('Error initializing CSV files:', error);
//       throw error;
//     }
//   }

//   async findFile(fileName) {
//     try {
//       const response = await this.drive.files.list({
//         q: `name = '${fileName}' and '${this.parentFolderId}' in parents and trashed = false`,
//         fields: 'files(id, name, webViewLink)',
//         spaces: 'drive'
//       });

//       return response.data.files[0];
//     } catch (error) {
//       console.error('Error finding file:', error);
//       return null;
//     }
//   }

//   async createCsv(fileName, headers) {
//     try {
//       const tempFilePath = path.join(this.tempDir, fileName);
      
//       // Create CSV with headers
//       const csvWriter = createCsvWriter({
//         path: tempFilePath,
//         header: headers
//       });
//       await csvWriter.writeRecords([]);

//       // Upload to Drive
//       const fileMetadata = {
//         name: fileName,
//         parents: [this.parentFolderId],
//         mimeType: 'text/csv'
//       };

//       const media = {
//         mimeType: 'text/csv',
//         body: fs.createReadStream(tempFilePath)
//       };

//       const file = await this.drive.files.create({
//         resource: fileMetadata,
//         media: media,
//         fields: 'id, webViewLink'
//       });

//       // Clean up temp file
//       await fsPromises.unlink(tempFilePath);
//       console.log('Created CSV file. Link:', file.data.webViewLink);
      
//       return file.data.id;
//     } catch (error) {
//       console.error('Error creating CSV:', error);
//       throw error;
//     }
//   }

//   async appendToCsv(csvId, records) {
//     try {
//       const tempFilePath = path.join(this.tempDir, `temp_${csvId}.csv`);
//       await this.downloadFile(csvId, tempFilePath);

//       // Process records to ensure they match header structure
//       const processedRecords = records.map(record => {
//         const formData = typeof record.formData === 'string' ? 
//           record.formData : JSON.stringify(record.formData);
        
//         const files = typeof record.files === 'string' ? 
//           record.files : JSON.stringify(record.files || []);

//         return {
//           id: record.id,
//           type: record.type,
//           timestamp: record.timestamp,
//           folderId: record.folderId || '',
//           folderLink: record.folderLink || '',
//           formData: formData,
//           files: files
//         };
//       });

//       // Create CSV writer with base headers
//       const csvWriter = createCsvWriter({
//         path: tempFilePath,
//         header: this.baseHeaders,
//         append: true
//       });

//       // Write records
//       await csvWriter.writeRecords(processedRecords);

//       // Upload updated CSV back to Drive
//       await this.updateFile(csvId, tempFilePath);
//       await fsPromises.unlink(tempFilePath);
      
//       console.log('Successfully appended records to CSV');
//     } catch (error) {
//       console.error('Error appending to CSV:', error);
//       throw error;
//     }
//   }

//   // Rest of the methods remain the same
//   async createFolder(folderName) {
//     try {
//       const folderMetadata = {
//         name: folderName,
//         mimeType: 'application/vnd.google-apps.folder',
//         parents: [this.parentFolderId]
//       };

//       const folder = await this.drive.files.create({
//         resource: folderMetadata,
//         fields: 'id, webViewLink'
//       });

//       console.log('Created folder:', folderName, 'Link:', folder.data.webViewLink);
      
//       return {
//         id: folder.data.id,
//         link: folder.data.webViewLink
//       };
//     } catch (error) {
//       console.error('Error creating folder:', error);
//       throw error;
//     }
//   }

//   async uploadFile(filePath, fileName, folderId = null) {
//     try {
//       const fileMetadata = {
//         name: fileName,
//         parents: [folderId || this.parentFolderId]
//       };

//       const media = {
//         mimeType: this.getMimeType(fileName),
//         body: fs.createReadStream(filePath)
//       };

//       const file = await this.drive.files.create({
//         resource: fileMetadata,
//         media: media,
//         fields: 'id, webViewLink'
//       });

//       console.log('Uploaded file:', fileName, 'Link:', file.data.webViewLink);
      
//       return {
//         id: file.data.id,
//         link: file.data.webViewLink
//       };
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       throw error;
//     }
//   }

//   async downloadFile(fileId, destPath) {
//     try {
//       const dest = fs.createWriteStream(destPath);
//       const response = await this.drive.files.get(
//         { fileId, alt: 'media' },
//         { responseType: 'stream' }
//       );
//       await new Promise((resolve, reject) => {
//         response.data
//           .pipe(dest)
//           .on('finish', resolve)
//           .on('error', reject);
//       });
//     } catch (error) {
//       console.error('Error downloading file:', error);
//       throw error;
//     }
//   }

//   async updateFile(fileId, filePath) {
//     try {
//       const media = {
//         mimeType: 'text/csv',
//         body: fs.createReadStream(filePath)
//       };

//       await this.drive.files.update({
//         fileId: fileId,
//         media: media
//       });
      
//       console.log('Successfully updated file:', fileId);
//     } catch (error) {
//       console.error('Error updating file:', error);
//       throw error;
//     }
//   }

//   getMimeType(fileName) {
//     const ext = path.extname(fileName).toLowerCase();
//     const mimeTypes = {
//       '.csv': 'text/csv',
//       '.pdf': 'application/pdf',
//       '.doc': 'application/msword',
//       '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//       '.jpg': 'image/jpeg',
//       '.jpeg': 'image/jpeg',
//       '.png': 'image/png'
//     };
//     return mimeTypes[ext] || 'application/octet-stream';
//   }

//   // Utility method to verify service is working
//   async verifyService() {
//     try {
//       // Check if parent folder exists
//       const folder = await this.drive.files.get({
//         fileId: this.parentFolderId,
//         fields: 'id, name, webViewLink'
//       });
      
//       console.log('Successfully verified parent folder:', folder.data.name);
//       console.log('Folder link:', folder.data.webViewLink);
      
//       return {
//         success: true,
//         folder: {
//           id: folder.data.id,
//           name: folder.data.name,
//           link: folder.data.webViewLink
//         }
//       };
//     } catch (error) {
//       console.error('Service verification failed:', error);
//       throw error;
//     }
//   }
// }

// module.exports = new DriveService();



// services/driveService.js
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const os = require('os');

class DriveService {
  constructor() {
    this.drive = null;
    this.SCOPES = ['https://www.googleapis.com/auth/drive.file'];
    this.submissionsCsvId = null;
    this.parentFolderId = "1S9XNa0jY4eoupaF5KRyJ728_MdVNJTzy";
    this.tempDir = path.join(os.tmpdir(), 'submissions-temp');
    this.headers = [
      { id: 'id', title: 'Submission ID' },
      { id: 'type', title: 'Submission Type' },
      { id: 'timestamp', title: 'Timestamp' },
      { id: 'folderId', title: 'Folder ID' },
      { id: 'folderLink', title: 'Folder Link' },
      { id: 'formData', title: 'Form Data' },
      { id: 'files', title: 'Files' }
    ];
  }

  async initialize() {
    try {
      // Initialize Google Auth
      const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, '..', 'credentials', 'google-credentials.json'),
        scopes: this.SCOPES
      });

      this.drive = google.drive({ version: 'v3', auth });
      
      // Create temp directory
      await fsPromises.mkdir(this.tempDir, { recursive: true });

      // Verify parent folder exists
      if (!this.parentFolderId) {
        console.error('GOOGLE_DRIVE_FOLDER_ID not found in environment variables');
        throw new Error('Parent folder ID not configured');
      }

      // Initialize CSV files
      await this.initializeCsvFiles();
      console.log('Drive service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize drive service:', error);
      throw error;
    }
  }

  async createRootFolder() {
    try {
      const folderMetadata = {
        name: 'Form Submissions Root',
        mimeType: 'application/vnd.google-apps.folder'
      };

      const folder = await this.drive.files.create({
        resource: folderMetadata,
        fields: 'id, webViewLink'
      });

      console.log('Created root folder. ID:', folder.data.id);
      console.log('Root folder link:', folder.data.webViewLink);
      
      return {
        id: folder.data.id,
        link: folder.data.webViewLink
      };
    } catch (error) {
      console.error('Error creating root folder:', error);
      throw error;
    }
  }

  async initializeCsvFiles() {
    try {
      // Look for existing submissions CSV
      const submissionsCsv = await this.findFile('form_submissions.csv');
      
      if (!submissionsCsv) {
        // Create new CSV if doesn't exist
        this.submissionsCsvId = await this.createCsv('form_submissions.csv', this.headers);
        console.log('Created new submissions CSV with ID:', this.submissionsCsvId);
      } else {
        this.submissionsCsvId = submissionsCsv.id;
        console.log('Found existing submissions CSV with ID:', this.submissionsCsvId);
      }
    } catch (error) {
      console.error('Error initializing CSV files:', error);
      throw error;
    }
  }

  async findFile(fileName) {
    try {
      const response = await this.drive.files.list({
        q: `name = '${fileName}' and '${this.parentFolderId}' in parents and trashed = false`,
        fields: 'files(id, name, webViewLink)',
        spaces: 'drive'
      });

      return response.data.files[0];
    } catch (error) {
      console.error('Error finding file:', error);
      return null;
    }
  }

  async createCsv(fileName, headers) {
    try {
      const tempFilePath = path.join(this.tempDir, fileName);
      
      // Create CSV with headers
      const csvWriter = createCsvWriter({
        path: tempFilePath,
        header: headers
      });
      await csvWriter.writeRecords([]);

      // Upload to Drive
      const fileMetadata = {
        name: fileName,
        parents: [this.parentFolderId],
        mimeType: 'text/csv'
      };

      const media = {
        mimeType: 'text/csv',
        body: fs.createReadStream(tempFilePath)
      };

      const file = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, webViewLink'
      });

      // Clean up temp file
      await fsPromises.unlink(tempFilePath);
      console.log('Created CSV file. Link:', file.data.webViewLink);
      
      return file.data.id;
    } catch (error) {
      console.error('Error creating CSV:', error);
      throw error;
    }
  }

  async appendToCsv(csvId, records) {
    try {
      const tempFilePath = path.join(this.tempDir, `temp_${csvId}.csv`);
      
      // Download current CSV
      await this.downloadFile(csvId, tempFilePath);

      // Append new records
      const csvWriter = createCsvWriter({
        path: tempFilePath,
        header: this.headers,
        append: true
      });

      await csvWriter.writeRecords(records);

      // Upload updated CSV back to Drive
      await this.updateFile(csvId, tempFilePath);
      
      // Clean up
      await fsPromises.unlink(tempFilePath);
      
      console.log('Successfully appended records to CSV');
    } catch (error) {
      console.error('Error appending to CSV:', error);
      throw error;
    }
  }

  async createFolder(folderName) {
    try {
      const folderMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [this.parentFolderId]
      };

      const folder = await this.drive.files.create({
        resource: folderMetadata,
        fields: 'id, webViewLink'
      });

      console.log('Created folder:', folderName, 'Link:', folder.data.webViewLink);
      
      return {
        id: folder.data.id,
        link: folder.data.webViewLink
      };
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }

  async uploadFile(filePath, fileName, folderId = null) {
    try {
      const fileMetadata = {
        name: fileName,
        parents: [folderId || this.parentFolderId]
      };

      const media = {
        mimeType: this.getMimeType(fileName),
        body: fs.createReadStream(filePath)
      };

      const file = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, webViewLink'
      });

      console.log('Uploaded file:', fileName, 'Link:', file.data.webViewLink);
      
      return {
        id: file.data.id,
        link: file.data.webViewLink
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async downloadFile(fileId, destPath) {
    try {
      const dest = fs.createWriteStream(destPath);
      
      const response = await this.drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' }
      );

      await new Promise((resolve, reject) => {
        response.data
          .pipe(dest)
          .on('finish', resolve)
          .on('error', reject);
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  async updateFile(fileId, filePath) {
    try {
      const media = {
        mimeType: 'text/csv',
        body: fs.createReadStream(filePath)
      };

      await this.drive.files.update({
        fileId: fileId,
        media: media
      });
      
      console.log('Successfully updated file:', fileId);
    } catch (error) {
      console.error('Error updating file:', error);
      throw error;
    }
  }

  getMimeType(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const mimeTypes = {
      '.csv': 'text/csv',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png'
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  // Utility method to verify service is working
  async verifyService() {
    try {
      // Check if parent folder exists
      const folder = await this.drive.files.get({
        fileId: this.parentFolderId,
        fields: 'id, name, webViewLink'
      });
      
      console.log('Successfully verified parent folder:', folder.data.name);
      console.log('Folder link:', folder.data.webViewLink);
      
      return {
        success: true,
        folder: {
          id: folder.data.id,
          name: folder.data.name,
          link: folder.data.webViewLink
        }
      };
    } catch (error) {
      console.error('Service verification failed:', error);
      throw error;
    }
  }
}

module.exports = new DriveService();