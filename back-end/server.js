// // server.js
// const express = require('express');
// const multer = require('multer');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs');
// const { v4: uuidv4 } = require('uuid');

// const app = express();

// // Create uploads directory if it doesn't exist
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Middleware
// app.use(cors());
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// // Configure multer for file upload
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
//     cb(null, uniqueName);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = [
//     'application/pdf',
//     'application/msword',
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     'image/jpeg',
//     'image/png'
//   ];
  
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error(`Invalid file type: ${file.mimetype}`), false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB limit
//     files: 5 // Maximum 5 files
//   }
// });

// // Handle form submission with files
// app.post('/api/submit', upload.array('files'), (req, res) => {
//   try {
//     let formData;
    
//     try {
//       formData = JSON.parse(req.body.formData);
//     } catch (error) {
//       console.error('Error parsing form data:', error);
//       return res.status(400).json({
//         error: 'Invalid form data format'
//       });
//     }

//     // Get file information if files were uploaded
//     const files = req.files ? req.files.map(file => ({
//       id: path.parse(file.filename).name,
//       originalName: file.originalname,
//       path: file.path
//     })) : [];

//     // Log the received data
//     console.log('Received form submission:', {
//       formData,
//       attachedFiles: files
//     });

//     // Send success response
//     res.json({
//       success: true,
//       message: 'Form submitted successfully',
//       submissionId: uuidv4(),
//       files: files.map(f => ({
//         id: f.id,
//         name: f.originalName
//       }))
//     });

//   } catch (error) {
//     console.error('Error processing submission:', error);
//     res.status(500).json({
//       error: 'Failed to process form submission',
//       details: error.message
//     });
//   }
// });

// // NEW ENDPOINT: Handle form submission without files
// // Add this multer configuration for parsing form data without files
// const formDataParser = multer();

// app.post('/api/submitintake', formDataParser.none(), (req, res) => {
//   try {
//     let formData;
    
//     try {
//       formData = JSON.parse(req.body.formData);
//     } catch (error) {
//       console.error('Error parsing form data:', error);
//       return res.status(400).json({
//         error: 'Invalid form data format'
//       });
//     }

//     // Log the received data
//     console.log('Received form submission (no files):', {
//       formData
//     });

//     // Send success response
//     res.json({
//       success: true,
//       message: 'Form submitted successfully',
//       submissionId: uuidv4()
//     });

//   } catch (error) {
//     console.error('Error processing submission:', error);
//     res.status(500).json({
//       error: 'Failed to process form submission',
//       details: error.message
//     });
//   }
// });

// // Error handling middleware
// app.use((error, req, res, next) => {
//   console.error('Error:', error);
  
//   if (error instanceof multer.MulterError) {
//     if (error.code === 'LIMIT_FILE_SIZE') {
//       return res.status(400).json({
//         error: 'File too large. Maximum size is 10MB'
//       });
//     }
//     if (error.code === 'LIMIT_FILE_COUNT') {
//       return res.status(400).json({
//         error: 'Too many files. Maximum is 5 files'
//       });
//     }
//     return res.status(400).json({
//       error: `Multer error: ${error.message}`
//     });
//   }
  
//   res.status(500).json({
//     error: 'Internal server error',
//     details: error.message
//   });
// });

// // Serve uploaded files statically (for development only)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// const port = 3001;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
//   console.log(`Upload directory: ${uploadDir}`);
// });

// server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Path for storing form submissions
const submissionsFile = path.join(__dirname, 'submissions.json');

// Initialize submissions file if it doesn't exist
if (!fs.existsSync(submissionsFile)) {
  fs.writeFileSync(submissionsFile, JSON.stringify({ submissions: [] }, null, 2));
}

// Function to read submissions
const readSubmissions = () => {
  try {
    const data = fs.readFileSync(submissionsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading submissions:', error);
    return { submissions: [] };
  }
};

// Function to save submissions
const saveSubmission = (submission) => {
  try {
    const data = readSubmissions();
    data.submissions.push(submission);
    fs.writeFileSync(submissionsFile, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving submission:', error);
    return false;
  }
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files
  }
});

// Handle form submission with files
app.post('/api/submit', upload.array('files'), (req, res) => {
  try {
    let formData;
    
    try {
      formData = JSON.parse(req.body.formData);
    } catch (error) {
      console.error('Error parsing form data:', error);
      return res.status(400).json({
        error: 'Invalid form data format'
      });
    }

    const files = req.files ? req.files.map(file => ({
      id: path.parse(file.filename).name,
      originalName: file.originalname,
      path: file.path
    })) : [];

    const submissionId = uuidv4();
    const timestamp = new Date().toISOString();
    
    // Create submission record
    const submission = {
      id: submissionId,
      type: 'file_submission',
      timestamp,
      formData,
      files: files.map(f => ({
        id: f.id,
        name: f.originalName,
        path: f.path
      }))
    };

    // Save submission
    if (!saveSubmission(submission)) {
      throw new Error('Failed to save submission');
    }

    // Log the received data
    console.log('Received form submission:', submission);

    // Send success response
    res.json({
      success: true,
      message: 'Form submitted successfully',
      submissionId,
      files: files.map(f => ({
        id: f.id,
        name: f.originalName
      }))
    });

  } catch (error) {
    console.error('Error processing submission:', error);
    res.status(500).json({
      error: 'Failed to process form submission',
      details: error.message
    });
  }
});

// Handle form submission without files
const formDataParser = multer();

app.post('/api/submitintake', formDataParser.none(), (req, res) => {
  try {
    let formData;
    
    try {
      formData = JSON.parse(req.body.formData);
    } catch (error) {
      console.error('Error parsing form data:', error);
      return res.status(400).json({
        error: 'Invalid form data format'
      });
    }

    const submissionId = uuidv4();
    const timestamp = new Date().toISOString();

    // Create submission record
    const submission = {
      id: submissionId,
      type: 'intake_submission',
      timestamp,
      formData
    };

    // Save submission
    if (!saveSubmission(submission)) {
      throw new Error('Failed to save submission');
    }

    // Log the received data
    console.log('Received form submission (no files):', submission);

    // Send success response
    res.json({
      success: true,
      message: 'Form submitted successfully',
      submissionId
    });

  } catch (error) {
    console.error('Error processing submission:', error);
    res.status(500).json({
      error: 'Failed to process form submission',
      details: error.message
    });
  }
});

// Add new endpoint to get all submissions
app.get('/api/submissions', (req, res) => {
  try {
    const data = readSubmissions();
    res.json(data);
  } catch (error) {
    console.error('Error reading submissions:', error);
    res.status(500).json({
      error: 'Failed to retrieve submissions',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large. Maximum size is 10MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files. Maximum is 5 files'
      });
    }
    return res.status(400).json({
      error: `Multer error: ${error.message}`
    });
  }
  
  res.status(500).json({
    error: 'Internal server error',
    details: error.message
  });
});

// Serve uploaded files statically (for development only)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Upload directory: ${uploadDir}`);
});