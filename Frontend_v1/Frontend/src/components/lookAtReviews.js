import React, { useState } from 'react';
import axios from 'axios';

const Look = ({ url }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');

  const categories = ['Durability', 'Accessibility', 'Price', 'Versatility', 'Ease of Use'];

  const [reviews, setReviews] = useState(
    [
    "I've been using these shoes for months, and they are still holding up great. The durability is impressive, even after constant use on the court.",
    "Not happy with how quickly these shoes wore out. After just a few games, the soles are already starting to come apart.",
    "The shoes were decent, but after about two months, they started to show signs of wear and tear. Definitely not as durable as I had hoped.",
    "These shoes are way overpriced for what you get. The design is nice, but I don’t think they’re worth the money.",
    "I can’t believe how long these shoes have lasted! I’ve played in them every weekend, and they still feel as solid as the first day I wore them.",
    "The shoes were decent, but after about two months, they started to show signs of wear and tear. Definitely not as durable as I had hoped.",
    "These shoes are built like a tank! I've played on rough outdoor courts, and they've held up amazingly well.",
    "The fit is okay, but I expected more comfort given the price point. They’re not as cushioned as I hoped they would be.",
    "Honestly, I bought these just because they look cool. I don’t care much about the performance, but the aesthetic is top-notch.",
    "These shoes are way overpriced for what you get. The design is nice, but I don’t think they’re worth the money.",
    "I love the look and style of these shoes, but they definitely aren’t budget-friendly. You can find similar shoes for a lower price.",
    "While they perform well on the court, the price tag is just too high. I don’t think they offer good value for the cost."
    
  ]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category) // Deselect
        : [...prev, category] // Select
    );
  };

  const handleQuestionChange = (e) => {
    setNewQuestion(e.target.value);
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (newQuestion.trim() !== '') {
      const questionObject = {
        text: newQuestion,
        url: url
      };
      try {
        const response = await axios.post('http://127.0.0.1:5000/search_review', questionObject);
        console.log('Response:', response.data);
        setReviews(response.data)
      } catch (error) {
        console.error('Error posting data:', error.response ? error.response.data : error.message);
      }

      setNewQuestion(''); // Clear the input field after submission
    }
  };

  return (
    <div className="bg-red-500 p-4 rounded-lg w-full max-w-xl">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-2">Categories:</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <span key={index} 
              onClick={() => toggleCategory(category)}
              className={`px-3 py-1 rounded-full text-sm cursor-pointer 
                ${selectedCategories.includes(category) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              {category}
            </span>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmitQuestion} className="mb-4">
        <textarea
          value={newQuestion}
          onChange={handleQuestionChange}
          placeholder="What would you like to know about this product..."
          className="w-full p-2 border border-gray-300 rounded-lg"
          rows="3"
        />
        <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
          Submit Question
        </button>
      </form>

      <div className="space-y-3 overflow-y-auto" style={{ maxHeight: '300px' }}>
        {reviews.map((review, index) => (
          <div key={index} className="bg-gray-100 p-3 rounded-lg">
            <p className="text-sm mb-2">{review}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Look;