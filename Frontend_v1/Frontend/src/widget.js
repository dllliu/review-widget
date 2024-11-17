import React, { useState, useEffect } from 'react';
import { ChevronDown} from 'lucide-react';
import Look from './components/lookAtReviews'
import Make from './components/makeReview.js'
import axios from 'axios'


const postUrl = async () => {
  const url = 'xyz.com';
  try {
      const response = await axios.post('http://127.0.0.1:5000/process_product', url, {
          headers: {
              'Content-Type': 'application/json',
          }
      });
      return JSON.stringify(response.data.questions[0]);
  } catch (error) {
      if (error.response) {
          // The request was made and the server responded with a status code
          console.error('Error Response:', error.response.data);
          console.error('Error Status:', error.response.status);
      } else if (error.request) {
          // The request was made but no response was received
          console.error('Error Request:', error.request);
      } else {
          // Something happened in setting up the request
          console.error('Error Message:', error.message);
      }
      return '';
  }
};

const Widget = () => {
  const [activeOption, setActiveOption] = useState(null);
  const [question, setQuestion] = useState([]);
  useEffect(() => {
    const fetchQuestion = async () => {
      const questionData = await postUrl(); // Wait for the postUrl to complete
      setQuestion(questionData); // Set the question state with the resolved value
    };
  
    fetchQuestion(); // Call the async function to fetch the question
  }, []);


  
  
  useEffect(() => {
    console.log("webpage loaded");
    const currentUrl = window.location.href;
    let url = "https://kith.com/collections/kith-footwear/products/x2j162xf85500";
    // setUrl(currentUrl);
    const postUrl = async () => {
      const urlData = {
        url: url
      };

      try {
        const response = await axios.post('http://localhost:5000/process_product', urlData);
        const data = await response.json();
                if (response.ok) {
                    console.log('URL added:', data);
                } else {
                    console.error('Error adding URL:', data);
                }
      } catch (error) {
          console.error('Network error:', error);
      }
      
    };

    postUrl(); // Call the function to post data
  }, ["https://kith.com/collections/kith-footwear/products/x2j162xf85500"]);
  


  
  const toggleOption = (option) => {
    setActiveOption(activeOption === option ? null : option);
  };

  

  return (
    <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg">
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => toggleOption('leave')}
          className="flex items-center justify-between px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
        >
          Leave a Review
          <ChevronDown className={`ml-2 transition-transform ${activeOption === 'leave' ? 'rotate-180' : ''}`} />
        </button>
        <button
          onClick={() => toggleOption('look')}
          className="flex items-center justify-between px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
        >
          Look at Reviews
          <ChevronDown className={`ml-2 transition-transform ${activeOption === 'look' ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {activeOption === 'leave' && <Make question = {question}/>}
      
      {activeOption === 'look' && <Look url = 'xyz.com'/>}
    </div>
  );
};

export default Widget;