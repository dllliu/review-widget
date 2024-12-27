// chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//   const currentTab = tabs[0];
//   fetch('http://localhost:5000/find_reviews_from_url', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ url: currentTab.url })  // Send URL as JSON
//   })
//   .then(response => response.json())
//   .then(data => {
//     console.log('Success:', data);

//     document.getElementById('all_reviews').textContent = JSON.stringify(data);
    
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });
// })

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0];
  fetch('http://localhost:5000/find_reviews_from_url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: currentTab.url })  // Send URL as JSON
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);

    let displayContent = '';

    // Loop through the array of reviews
    if (Array.isArray(data)) {
      data.forEach((entry, index) => {
        displayContent += `<div style="border: 1px solid #ccc; width: 400px;">`;
        // displayContent += `<p><strong>Review ${index + 1}</strong></p>`;
        displayContent += `<p><strong>Category:</strong> ${entry.category}</p>`;
        displayContent += `<p><strong>Created At:</strong> ${new Date(entry.created_at).toLocaleString()}</p>`;
        displayContent += `<p><strong>Rating:</strong> ${entry.rating}</p>`;
        displayContent += `<p><strong>Review:</strong> ${entry.review}</p>`;
        // displayContent += `<p><strong>URL:</strong> <a href="${entry.url}" target="_blank">${entry.url}</a></p>`;
        // displayContent += `<p><strong>Host Site:</strong> ${entry.hostSite}</p>`;
        displayContent += '</div>';
      });
    }

    // Set the formatted content in the element with ID 'all_reviews'
    document.getElementById('all_reviews').innerHTML = displayContent;
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});


document.getElementById("goBackToPage1").addEventListener("click", function() {
    // Load the first page (popup.html) in the popup
    document.location.href = chrome.runtime.getURL("popup/hello.html");
  });