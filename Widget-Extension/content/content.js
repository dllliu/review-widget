console.log("Content Script Loaded");



// // content.js
// chrome.runtime.sendMessage({ action: "getCurrentUrl" }, (response) => {
//   const currentUrl = response.currentUrl;
//   console.log("Received URL from background:", currentUrl);
//   sendToBackend(currentUrl);
// });

// function sendToBackend(url) {
//   fetch('http://localhost:5000/url_receiver', {
//       method: 'POST',
//       headers: {
//           'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//           current_url: url  
//       })
//   })
//   .then(response => response.json())
//   .then(data => {
//       console.log('Response from backend:', data);
//   })
//   .catch(error => {
//       console.error('Error:', error);
//   });
// }

// still need to figure out how to modify inner html

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === 'modifyPage') {
//       const data = message.data;
//       document.body.innerHTML = `<h1>Data from Supabase: ${JSON.stringify(data, null, 2)}</h1>`;
//     }
//   });
  