import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import axios from 'axios';

const Make = ({question}) => {
  const [url, setUrl] = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Get the full URL of the current page
    setUrl('xyz.com'); // Set the URL to the state
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission

    const reviewData = {
      url: url,
      rating: rating,
      review: review,
      email: email,
    };

    try {
      const response = await axios.post('http://127.0.0.1:5000/submit_review', reviewData);
      console.log('Response:', response.data);
      setSubmitted(true); // Update state to show thank you message
    } catch (error) {
      console.error('Error posting data:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="bg-red-500 p-6 rounded-lg w-full max-w-md">
      <div className="relative">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p className="text-white mb-2">RATING :</p>
              <div className="flex justify-center bg-white rounded-full p-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    className={`cursor-pointer ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            <p className="text-white mb-2">You can consider: {typeof question === 'string' ? question : ''}</p>
            <div>
              <p className="text-white mb-2">REVIEW :</p>
              <textarea
                className="w-full p-3 rounded-3xl"
                rows="4"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review here..."
              />
            </div>
            <div>
              <p className="text-white mb-2">EMAIL:</p>
              <input
                type="email"
                className="w-full p-3 rounded-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-gray-400 text-white rounded-full hover:bg-gray-500 transition-colors float-right"
            >
              SUBMIT
            </button>
          </form>
        ) : (
          <div className="relative flex flex-col items-center">
            <h1 className="text-5xl font-bold mt-4 animate-bounce text-white">Thank You!</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Make;