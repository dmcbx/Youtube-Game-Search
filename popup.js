document.addEventListener('DOMContentLoaded', () => {
  
  const input = document.getElementById('suffixWord');
  const saveButton = document.getElementById('saveButton');
  const status = document.getElementById('status');
  const suggestionButtons = document.querySelectorAll('.suggestion-btn');
  const historyList = document.getElementById('history-list');
  const noHistoryMsg = document.getElementById('no-history');

  const DEFAULTS = ['gameplay', 'full gameplay', 'walkthrough', 'review'];
  const HISTORY_LIMIT = 5;

  chrome.storage.sync.get(['customSuffix'], (result) => {
    input.value = result.customSuffix || 'full gameplay';
  });

  loadHistory();

  saveButton.addEventListener('click', () => {
    saveAndApplySuffix(input.value);
  });

  suggestionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const suffix = button.dataset.value;
      saveAndApplySuffix(suffix);
    });
  });

  historyList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const textToRemove = e.target.dataset.value;
      removeHistoryItem(textToRemove);
    }
    else if (e.target.classList.contains('history-text')) {
      saveAndApplySuffix(e.target.textContent);
    }
  });


  function saveAndApplySuffix(suffix) {
    suffix = suffix.trim();
    if (!suffix) return;

    chrome.storage.sync.set({ customSuffix: suffix }, () => {
      input.value = suffix;
      showStatusMessage('Saved!');
      
      if (!DEFAULTS.includes(suffix.toLowerCase())) {
        addHistoryItem(suffix);
      }
    });
  }

  function showStatusMessage(message) {
    status.textContent = message;
    setTimeout(() => {
      status.textContent = '';
    }, 1500);
  }

  function loadHistory() {
    chrome.storage.sync.get(['suffixHistory'], (result) => {
      const history = result.suffixHistory || [];
      renderHistory(history);
    });
  }

  function renderHistory(history) {
    historyList.innerHTML = '';
    
    if (history.length === 0) {
      noHistoryMsg.style.display = 'block';
    } else {
      noHistoryMsg.style.display = 'none';
      history.forEach(item => {
        const li = document.createElement('li');
        
        const textSpan = document.createElement('span');
        textSpan.className = 'history-text';
        textSpan.textContent = item;
        
        const deleteSpan = document.createElement('span');
        deleteSpan.className = 'delete-btn';
        deleteSpan.textContent = '×';
        deleteSpan.dataset.value = item;
        deleteSpan.title = 'Remove';
        
        li.appendChild(textSpan);
        li.appendChild(deleteSpan);
        historyList.appendChild(li);
      });
    }
  }

  function addHistoryItem(item) {
    chrome.storage.sync.get(['suffixHistory'], (result) => {
      let history = result.suffixHistory || [];
      
      history = history.filter(h => h.toLowerCase() !== item.toLowerCase());
      
      history.unshift(item);
      
      history = history.slice(0, HISTORY_LIMIT);
      
      chrome.storage.sync.set({ suffixHistory: history }, () => {
        renderHistory(history);
      });
    });
  }

  function removeHistoryItem(item) {
    chrome.storage.sync.get(['suffixHistory'], (result) => {
      let history = result.suffixHistory || [];
      history = history.filter(h => h.toLowerCase() !== item.toLowerCase());
      chrome.storage.sync.set({ suffixHistory: history }, () => {
        renderHistory(history);
      });
    });
  }

});