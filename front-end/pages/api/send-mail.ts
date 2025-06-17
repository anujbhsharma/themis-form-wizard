import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { generateEmailHTML } from '../../src/lib/email-template'; // if you're using baseUrl in tsconfig
import { randomUUID } from 'crypto'; 

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

    const submissionId = randomUUID();
    const formdata = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const emailContent = generateEmailHTML(formdata.formData);
  

  try {
    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: process.env.MAILGUN_FROM,
      to: process.env.EMAIL_TO,
      subject: `New Eligibility Form Submission: ${submissionId}`,
      text: emailContent,
      // Optional: reduce logs for privacy
      'o:tracking': 'no',
      'o:deliverytime': 'now',
    });

    res.status(200).json({ success: true, id: result.id, submissionId });
  } catch (error) {
    console.error("Email error:", error.message);
    res.status(500).json({ error: 'Email failed to send' });
  }
}


// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const response = await fetch('/api/send-mail', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       email: 'client@example.com',
//       subject: 'Your Message',
//       message: 'This is private and secure!',
//     }),
//   });

//   const data = await response.json();
//   if (data.success) {
//     alert("Email sent!");
//   } else {
//     alert("Failed to send email.");
//   }
// };
