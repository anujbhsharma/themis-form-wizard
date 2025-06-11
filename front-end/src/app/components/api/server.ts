// components/api/server.js
import { randomUUID } from 'crypto'; 
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const emailContent = req.body;

  // Configure Nodemailer with SMTP (Gmail example)
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD, // Use app password for Gmail
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: process.env.EMAIL_USERNAME, // Send to yourself
    subject: 'New Form Submission',
    html: emailContent,
  };

  const submissionId = randomUUID();

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent successfully', submissionId  });
  } catch (err: any) {
    console.error('Email error:', err);
    res.status(500).json({ message: 'Failed to send email', error: err.message, submissionId });
  }
}

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Only POST requests allowed' });
//   }
//     const formData = req.body;
//     // Create FormData instance
//     const submitData = new FormData();
//     // Add form data as a string
//     submitData.append('formData', JSON.stringify(formData));
//     console.log('SUBMISSION: ', submitData);

//   const emailContent = Object.entries(formData)
//     .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
//     .join('');

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: process.env.EMAIL_USER,
//     subject: 'New Form Submission',
//     html: emailContent,
//   };

//   const submissionId = randomUUID();

//   try {
//     await transporter.sendMail(mailOptions);
//     return res.status(200).json({ message: 'Email sent successfully', 
//     submissionId  });
//   } catch (error) {
//     console.error('Email sending error:', error);
//     return res.status(500).json({ message: 'Email sending failed', error });
//   }
// }


// import formidable from 'formidable';

// export const config = {
//   api: {
//     bodyParser: false, // Required for FormData
//   },
// };

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   const form = new formidable.IncomingForm({ multiples: true });

//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       console.error('Form parsing error:', err);
//       return res.status(500).json({ message: 'Form parse error' });
//     }

//     const submitID = randomUUID();

//     // Just respond with the parsed values for now
//     return res.status(200).json({
//       message: 'Form received!',
//       submitID,
//       fields,
//       fileCount: Array.isArray(files.files) ? files.files.length : 1,
//     });
//   });
// }