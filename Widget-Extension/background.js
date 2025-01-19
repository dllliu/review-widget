// background.js (service worker)
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed or Service Worker Initialized");
  console.log("This is where you can run background tasks");
});

// function getCurrentTabUrl(callback) {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     const currentTab = tabs[0]; // Get the active tab
//     callback(currentTab.url); // Pass the URL to the callback
//   });
// }

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "getCurrentUrl") {
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//           const currentUrl = tabs[0].url;
//           console.log("Current URL:", currentUrl);
//           sendResponse({ currentUrl: currentUrl });
//       });
//       return true;  // This is necessary to indicate the response is asynchronous
//   }
// });