document.addEventListener('DOMContentLoaded', () => {
  const profilesDiv = document.getElementById('profiles');
  const copyButton = document.getElementById('copy');
  const blockedMessage = document.getElementById('blocked-message');
  const noProfilesMessage = document.getElementById('no-profiles-message');
//   const errorDiv = document.getElementById('error-message');


  if (!profilesDiv || !copyButton || !blockedMessage || !noProfilesMessage) {
      console.error("Required elements not found in the DOM.");
      return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = new URL(tabs[0].url);
    if (url.hostname !== 'toolzu.com') {
        blockedMessage.style.display = 'flex';
        profilesDiv.style.display = 'none';
        copyButton.style.display = 'none';
        noProfilesMessage.style.display = 'none';
        return;
    }
    else {
      blockedMessage.style.display = 'none';
  }

      console.log("Sending message to content script");
      chrome.tabs.sendMessage(tabs[0].id, { action: "extractProfiles" }, (response) => {
          if (chrome.runtime.lastError) {
              alert("error occured, please reload the page or the extension")
              console.error("Error sending message:", chrome.runtime.lastError.message);
              chrome.runtime.reload();
          } else {
              console.log("Received response:", response);
              if (response && response.profiles && response.profiles.length > 0) {
                  profilesDiv.innerHTML = response.profiles.map(username => `
                      <div class="profile">
                          <img src="https://ui-avatars.com/api/?name=${username}&background=random&length=1" alt="${username}">
                          <span>@${username}</span>
                      </div>
                  `).join('');
                  noProfilesMessage.style.display = 'none';
                  profilesDiv.style.display = 'block';
                  copyButton.style.display = 'block';

                  copyButton.addEventListener('click', () => {
                      navigator.clipboard.writeText(response.profiles.join(' , ')).then(() => {
                          copyButton.textContent = 'Copied!';
                          setTimeout(() => { copyButton.textContent = 'Copy Profiles'; }, 2000);
                      });
                  });
              } else {
                  profilesDiv.style.display = 'none';
                  copyButton.style.display = 'none';
                  noProfilesMessage.style.display = 'block';
              }
          }
      });
  });
});
