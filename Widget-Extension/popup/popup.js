chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0];  // Get the first tab from the query result

  chrome.storage.local.get(['reviewSummaries'], (result) => {
    if (result.reviewSummaries && result.reviewSummaries.url === currentTab.url) {
      console.log('Using cached review summaries');
      document.getElementById('review-summaries').textContent = JSON.stringify(result.reviewSummaries.data);
    } else {
      fetch('http://localhost:5000/review_summary', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: currentTab.url })  // Send URL as JSON
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);

        // Store the data in chrome storage
        chrome.storage.local.set({ reviewSummaries: { url: currentTab.url, data: data } }, () => {
          console.log('Review summaries stored in chrome storage');
        });

        document.getElementById('review-summaries').textContent = JSON.stringify(data);
        
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  });
});

document.getElementById('review-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const userQuestion = document.getElementById('user-question').value;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0]; // Get the active tab

    fetch('http://localhost:5000/question_query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: userQuestion,
        url: currentTab.url, // Include the current tab URL
      })
    })
    .then(response => response.json())  // Parse the JSON response
    .then(data => {
      console.log('Success:', data);
      
      document.getElementById('result').textContent = JSON.stringify(data);
      
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to submit question');
    });
  });
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0]; // Get the active tab

  // Ensure that we're executing the script in the context of the active tab
  chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    func: function() {
      // This function runs in the context of the active tab
      return document.documentElement.innerHTML; // Return the page's HTML content
    }
  }, (result) => {
    if (result && result[0]) {
      const htmlContent = result[0].result; // Get the HTML content from the result

      // Send the HTML content to the backend using fetch
      fetch('http://localhost:5000/product_startup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify that we're sending JSON
        },
        body: JSON.stringify({url: currentTab.url, html: JSON.stringify(htmlContent) }), // Send the HTML content in the body
      })
      .then(response => response.json()) // Assuming your backend returns JSON
      .then(data => {
        console.log("Backend response:", data);
        document.getElementById('prod').textContent = JSON.stringify(data);
        // You can handle the backend response here if needed
      })
      .catch(error => {
        console.error("Error sending HTML to backend:", error);
      });
    } else {
      console.error("Failed to retrieve HTML content");
    }
  });
});

document.getElementById("goToPage2").addEventListener("click", function() {
  document.location.href = chrome.runtime.getURL("popup/create-review.html");
});

document.getElementById("goToPage3").addEventListener("click", function() {
  document.location.href = chrome.runtime.getURL("popup/see-reviews.html");
});

document.getElementById('logout').addEventListener('click', function() {
  window.location.href = 'landing.html';
});