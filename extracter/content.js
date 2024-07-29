console.log("Content script loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message:", request);
  if (request.action === "extractProfiles") {
    const profiles = [];
    const profileElements = document.querySelectorAll('.card-body .media-body .d-block.text-dark.font-weight-medium');
    profileElements.forEach(profileElement => {
      const username = profileElement.textContent.trim();
      profiles.push(username);
    });
    console.log("Extracted profiles:", profiles);
    sendResponse({ profiles: profiles });
  }
});
