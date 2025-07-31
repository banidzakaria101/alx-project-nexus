// pages/api/contact.ts
import type { NextApiRequest, NextApiResponse } from 'next';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  if (req.method === 'POST') {
    const { name, email, message }: ContactFormData = req.body;

    // Basic server-side validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (!email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    try {
      // --- Simulate sending email or saving to DB ---
      // In a real application, you would integrate with an email sending service (e.g., Nodemailer, SendGrid)
      // or save this data to a database.

      console.log('--- New Contact Form Submission ---');
      console.log(`Name: ${name}`);
      console.log(`Email: ${email}`);
      console.log(`Message: ${message}`);
      console.log('-----------------------------------');

      // Simulate a delay for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Return a success response
      return res.status(200).json({ message: 'Your message has been sent successfully!' });

    } catch (error) {
      console.error('Error processing contact form submission:', error);
      return res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
  } else {
    // Handle any non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}