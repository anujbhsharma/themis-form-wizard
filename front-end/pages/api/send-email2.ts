import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { generateEmailHTML } from '../../src/lib/email-template'; // if you're using baseUrl in tsconfig
import { randomUUID } from 'crypto'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

    const submissionId = randomUUID();
    const formdata = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const emailContent = generateEmailHTML(formdata.formData);

  try {
    const transporter = nodemailer.createTransport({
      host: 'mail.smtp2go.com',
      port: 465,
      secure: true, // true = TLS
      auth: {
        user: process.env.SMTP2GO_USERNAME!,
        pass: process.env.SMTP2GO_PASSWORD!,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_TO, // e.g., "My App <mail@yourdomain.com>"
      to: process.env.EMAIL_TO,
      subject: `New Eligibility Form Submission: ${submissionId}`,
      text: emailContent,
    });

    return res.status(200).json({ success: true, submissionId });
  } catch (error: any) {
    console.error("SMTP2GO error:", error.message);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}


// 'use client'; // if using Next.js App Router

// import React, { useState } from 'react';

// const EmailForm: React.FC = () => {
//   const [form, setForm] = useState({ email: '', subject: '', message: '' });
//   const [status, setStatus] = useState<string | null>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setStatus(null);

//     const res = await fetch('/api/send-email2', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(form),
//     });

//     const data = await res.json();
//     setStatus(data.success ? 'Email sent!' : 'Error sending email');
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Recipient Email" required />
//       <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" required />
//       <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" required />
//       <button type="submit">Send Email</button>
//       {status && <p>{status}</p>}
//     </form>
//   );
// };

// export default EmailForm;