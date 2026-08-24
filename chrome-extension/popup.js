document.addEventListener('DOMContentLoaded', () => {
  const settingsView = document.getElementById('settings-view');
  const clipView = document.getElementById('clip-view');
  
  const tokenInput = document.getElementById('api-token');
  const saveTokenBtn = document.getElementById('save-settings-btn');
  const settingsMsg = document.getElementById('settings-msg');
  const clearTokenBtn = document.getElementById('clear-token-btn');

  const titleInput = document.getElementById('job-title');
  const companyInput = document.getElementById('job-company');
  const urlInput = document.getElementById('job-url');
  const clipBtn = document.getElementById('clip-btn');
  const clipMsg = document.getElementById('clip-msg');

  // Load token from storage
  chrome.storage.local.get(['careerSyncToken'], (result) => {
    if (result.careerSyncToken) {
      showClipView();
      extractPageData();
    } else {
      showSettingsView();
    }
  });

  saveTokenBtn.addEventListener('click', () => {
    const token = tokenInput.value.trim();
    if (!token) return;
    
    chrome.storage.local.set({ careerSyncToken: token }, () => {
      settingsMsg.textContent = 'Token saved!';
      settingsMsg.className = 'success';
      setTimeout(() => {
        showClipView();
        extractPageData();
      }, 1000);
    });
  });

  clearTokenBtn.addEventListener('click', () => {
    chrome.storage.local.remove('careerSyncToken', () => {
      showSettingsView();
    });
  });

  clipBtn.addEventListener('click', () => {
    clipBtn.disabled = true;
    clipBtn.textContent = 'Saving...';
    clipMsg.textContent = '';

    chrome.storage.local.get(['careerSyncToken'], (result) => {
      const token = result.careerSyncToken;
      
      // We will assume the server is running locally for this project, 
      // but in production this would be the real domain.
      const API_URL = 'http://localhost:3000/api/jobs/clip';
      
      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: titleInput.value.trim(),
          company: companyInput.value.trim(),
          applyUrl: urlInput.value.trim()
        })
      })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        clipBtn.textContent = 'Saved to CareerSync!';
        clipBtn.style.backgroundColor = '#1f6b45';
        setTimeout(() => {
          window.close();
        }, 1500);
      })
      .catch(error => {
        console.error('Error:', error);
        clipBtn.disabled = false;
        clipBtn.textContent = 'Save to Board';
        clipMsg.textContent = 'Failed to save job. Is the server running?';
        clipMsg.className = 'error';
      });
    });
  });

  function showSettingsView() {
    settingsView.classList.remove('hidden');
    clipView.classList.add('hidden');
  }

  function showClipView() {
    settingsView.classList.add('hidden');
    clipView.classList.remove('hidden');
  }

  function extractPageData() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      urlInput.value = currentTab.url || '';
      
      // Inject content script to extract better details if possible
      chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        files: ['content.js']
      }, (results) => {
        if (chrome.runtime.lastError || !results || !results.length) {
          // Fallback to tab title
          parseFallbackTitle(currentTab.title);
          return;
        }
        
        const data = results[0].result;
        if (data) {
          titleInput.value = data.title || '';
          companyInput.value = data.company || '';
          
          if (!data.title && !data.company) {
             parseFallbackTitle(currentTab.title);
          }
        }
      });
    });
  }

  function parseFallbackTitle(title) {
    if (!title) return;
    // Simple heuristic for "Job Title at Company | Site"
    const parts = title.split(' | ')[0].split(' at ');
    titleInput.value = parts[0] ? parts[0].trim() : title;
    companyInput.value = parts[1] ? parts[1].trim() : '';
  }
});
