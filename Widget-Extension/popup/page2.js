document.getElementById('review_help').addEventListener('click', function() {
    // First, fetch the current tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      
      // Fetch product questions and send the current tab's URL in the request
      fetch('http://localhost:5000/get_product_questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: currentTab.url })  // Pass the current tab's URL
      })
      .then(response => response.json())
      .then(data => {
        console.log('Product questions fetched:', data);

        let formattedQuestions = '';

        // Loop through each question in the 'data' object
        for (const key in data.questions) {
        formattedQuestions += data.questions[key] + '\n';  // Add each question with a newline
        }

        // Set the formatted questions as the inner text of the element with id 'product-questions'
        document.getElementById('product-questions').innerText = formattedQuestions;
        // document.getElementById('product-questions').innerText = JSON.stringify(data.questions);
      })
      .catch((error) => {
        console.error('Error fetching product questions:', error);
      });
    });
  });
  

document.getElementById("goBackToPage1").addEventListener("click", function() {
    // Load the first page (popup.html) in the popup
    document.location.href = chrome.runtime.getURL("popup/hello.html");
});

const ratingSlider = document.getElementById('rating');
const ratingValue = document.getElementById('ratingValue');

ratingSlider.addEventListener('input', function() {
ratingValue.textContent = ratingSlider.value;
});

document.getElementById('review-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the default form submission

    // Get the values from the form fields
    const rating = document.getElementById('rating').value;
    const review = document.getElementById('review').value;

    // Get the current active tab's URL (optional)
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        
        // Create a data object to send to the Flask backend
        const formData = {
            rating: rating,
            review: review,
            url: currentTab.url // Optional: Send the current tab URL to the backend
        };

        // Send the data to Flask backend
        fetch('http://localhost:5000/submit_review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)  // Convert the data to JSON
        })
        .then(response => response.json())  // Expect JSON response from Flask
        .then(data => {
            console.log('Review submitted successfully:', data);
            
            // Close the popup after submission to force Chrome to reopen it on the next click
            window.close();
        })
        .catch((error) => {
            console.error('Error submitting review:', error);
        });
    });
});
