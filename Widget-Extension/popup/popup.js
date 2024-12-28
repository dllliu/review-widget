// document.getElementById('fetchData').addEventListener('click', function() {
//   fetch('http://localhost:5000/api/test')
//     .then(response => response.json())
//     .then(data => {
//       document.getElementById('result').innerText = JSON.stringify(data);
//     })
//     .catch(error => console.error('Error:', error));
// });

// chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//   const currentTab = tabs[0];  // Get the first tab from the query result

//    fetch('http://localhost:5000/get_product_info_from_url', { 
// instead of this have review summary
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ url: currentTab.url })  // Send URL as JSON
//   })
//   .then(response => response.json())
//   .then(data => {
//     console.log('Success:', data);

//     document.getElementById('product-info-display').textContent = JSON.stringify(data);
    
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });
// });


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
  // Load the second page (page2.html) in the popup
  document.location.href = chrome.runtime.getURL("popup/create-review.html");
});

document.getElementById("goToPage3").addEventListener("click", function() {
  // Load the second page (page2.html) in the popup
  document.location.href = chrome.runtime.getURL("popup/see-reviews.html");
});