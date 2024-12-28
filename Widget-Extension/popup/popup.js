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

  fetch('http://localhost:5000/question_query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question: userQuestion,
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

document.getElementById("goToPage2").addEventListener("click", function() {
  document.location.href = chrome.runtime.getURL("popup/create-review.html");
});

document.getElementById("goToPage3").addEventListener("click", function() {
  document.location.href = chrome.runtime.getURL("popup/see-reviews.html");
});

document.getElementById('logout').addEventListener('click', function() {
  window.location.href = 'landing.html';
});