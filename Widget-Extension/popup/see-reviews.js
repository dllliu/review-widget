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
        displayContent += `<div class="review" id= \"${entry.id}\" style="border: 1px solid #ccc; width: 400px;">`;
        displayContent += `<p><strong>Category:</strong> ${entry.category}</p>`;
        displayContent += `<p><strong>Created At:</strong> ${new Date(entry.created_at).toLocaleString()}</p>`;
        displayContent += `<p><strong>Rating:</strong> ${entry.rating}</p>`;
        displayContent += `<p><strong>Review:</strong> ${entry.review}</p>`;
        displayContent += `<p><strong>Upvotes:</strong> <span class="upvote-count" data-id="${entry.id}">${entry.upvotes || 0}</span></p>`;
        displayContent += `<button class="upvote-btn" data-id="${entry.id}">Upvote</button>`;
        displayContent += `<button class="edit-btn" data-id="${entry.id}">Edit</button>`;
        displayContent += `<button class="delete-btn" data-id="${entry.id}">Delete</button>`;
        displayContent += '</div>';
      });

    }

    // Set the formatted content in the element with ID 'all_reviews'
    document.getElementById('all_reviews').innerHTML = displayContent;

    // Add event listeners for upvote, edit, and delete actions
    document.querySelectorAll('.upvote-btn').forEach(button => {
      button.addEventListener('click', handleUpvote);
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', handleEdit);
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', handleDelete);
    });

  })
  .catch((error) => {
    console.error('Error:', error);
  });
});

// Upvote handler
function handleUpvote(event) {
  const reviewId = event.target.getAttribute('data-id');
  // Send upvote request to the backend
  fetch('http://localhost:5000/upvote_review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviewId: reviewId })
  })
  .then(response => response.json())
  .then(data => {
    if (data) {
      alert('Upvoted successfully!');
      // Update the upvote count in the UI
      const upvoteCountElement = document.querySelector(`.upvote-count[data-id="${reviewId}"]`);
      if (upvoteCountElement) {
        upvoteCountElement.textContent = parseInt(upvoteCountElement.textContent) + 1;
      }
    }
  })
  .catch(error => console.error('Error upvoting:', error));
}

// Delete handler
function handleDelete(event) {
  const reviewId = event.target.getAttribute('data-id');
  
  // Send delete request to the backend
  fetch('http://localhost:5000/delete_review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviewId: reviewId })
  })
  .then(response => response.json())
  .then(data => {
    if (data){
      alert('Review deleted successfully!');
      location.reload();  // Reload to fetch updated reviews
    }
  })
  .catch(error => console.error('Error deleting review:', error));
}

// Edit handler
function handleEdit(event) {
  const reviewId = event.target.getAttribute('data-id');
  const newReviewText = prompt('Edit your review:');
  const newReviewRating = prompt('Edit your rating (1-5):');

  // Validate new review text and rating
  if (newReviewText && newReviewRating) {
    // Check if the new rating is a valid number
    const rating = parseInt(newReviewRating, 10);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      alert('Please enter a valid rating between 1 and 5.');
      return;
    }

    // Send edit request to the backend
    fetch('http://localhost:5000/edit_review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId: reviewId, newText: newReviewText, newRating: rating })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Review edited successfully!');
        location.reload();  // Reload to fetch updated reviews
      } else {
        alert('Failed to edit the review.');
      }
    })
    .catch(error => {
      console.error('Error editing review:', error);
      alert('An error occurred while editing the review.');
    });
  } else {
    alert('Both review text and rating are required.');
  }
}

document.getElementById("goBackToPage1").addEventListener("click", function() {
    // Load the first page (popup.html) in the popup
    document.location.href = chrome.runtime.getURL("popup/hello.html");
});
