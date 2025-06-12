// components/api/server.js
import { generateEmailHTML } from '../../src/lib/email-template'; // if you're using baseUrl in tsconfig
import { randomUUID } from 'crypto'; 
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const submissionId = randomUUID();
    const formdata = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const emailContent = generateEmailHTML(formdata.formData);


  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD, // App password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: process.env.EMAIL_USERNAME, 
    subject: `New Eligibility Form Submission: ${submissionId}`,
    html: emailContent,
  };


  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent successfully', submissionId  });
  } catch (err: any) {
    console.error('Email error:', err);
    res.status(500).json({ message: 'Failed to send email', error: err.message, submissionId });
  }
}
