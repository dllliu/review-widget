chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed!");
});

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === "getCurrentUrl") {
        // Get the current active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                const currentUrl = tabs[0].url; // Get the URL of the active tab
                sendResponse({ url: currentUrl }); // Send the URL back
            }
        });
        console.log("URL sent");
        return true; // Keep the message channel open for the response
    }
});