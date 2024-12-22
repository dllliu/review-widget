document.getElementById('fetchData').addEventListener('click', function() {
  fetch('http://localhost:5000/api/test')
    .then(response => response.json())
    .then(data => {
      document.getElementById('result').innerText = JSON.stringify(data);
    })
    .catch(error => console.error('Error:', error));
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0];  // Get the first tab from the query result
  document.getElementById('url-display').textContent = currentTab.url;
});