"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseMessage, setResponseMessage] = useState('');

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setResponseMessage('');
    setShowToast(false);

    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setResponseMessage('Please fill in all fields.');
      setToastMessage('Please fill in all fields.');
      setToastType('error');
      setShowToast(true);
      return;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setStatus('error');
      setResponseMessage('Please enter a valid email address.');
      setToastMessage('Please enter a valid email address.');
      setToastType('error');
      setShowToast(true);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setResponseMessage(data.message);
        setFormData({ name: '', email: '', message: '' });
        
        setToastMessage(data.message);
        setToastType('success');
        setShowToast(true);

      } else {
        setStatus('error');
        setResponseMessage(data.message || 'Something went wrong on the server.');
        
        setToastMessage(data.message || 'Error sending message.');
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setResponseMessage('Network error. Please try again.');
      
      setToastMessage('Network error. Please try again.');
      setToastType('error');
      setShowToast(true);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false);
        setToastMessage('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex items-center mb-8">
          <Link href="/" className="text-gray-400 hover:text-white mr-4">
            <ArrowLeftIcon className="h-8 w-8" />
          </Link>
          <h1 className="text-3xl font-bold">Contact Us</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg shadow-xl w-full">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-3 px-4 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
              placeholder="John Doe"
              disabled={status === 'loading'}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-3 px-4 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
              placeholder="john.doe@example.com"
              disabled={status === 'loading'}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-gray-300 text-sm font-bold mb-2">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className="shadow appearance-none border rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 placeholder-gray-400 resize-none"
              placeholder="Enter your message here..."
              disabled={status === 'loading'}
            ></textarea>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition-colors duration-200 ${status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>

            {responseMessage && !showToast && (
              <p className={`text-sm ml-4 ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {responseMessage}
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div
          
          className={`fixed top-[80px] z-50 p-4 rounded-lg shadow-xl text-white max-w-xs text-center
                      transition-all duration-300 transform
                      ${toastType === 'success' ? 'bg-green-600' : 'bg-red-600'}
                      ${showToast ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
                      left-1/2 -translate-x-1/2 /* Mobile: centered */
                      sm:left-auto sm:right-4 sm:transform-none`} 
          role="alert"
        >
          <p className="font-semibold">{toastType === 'success' ? 'Success!' : 'Error!'}</p>
          <p className="text-sm">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}

export default ContactPage;