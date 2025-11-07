chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ customSuffix: 'full gameplay' });
  chrome.storage.sync.set({ suffixHistory: [] });

  chrome.contextMenus.create({
    id: "smartSearch",
    title: "Smart Search",
    contexts: ["all"],
    visible: false
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.query) {
    const newTitle = `Search YouTube for '${message.query}'...`;
    
    chrome.contextMenus.update("smartSearch", {
      title: newTitle,
      visible: true
    });
    
    chrome.storage.local.set({ lastQuery: message.query });

  } else {
    chrome.contextMenus.update("smartSearch", {
      visible: false
    });
    chrome.storage.local.remove("lastQuery");
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "smartSearch") {
    
    chrome.storage.sync.get(['customSuffix'], (suffixResult) => {
      chrome.storage.local.get(['lastQuery'], (queryResult) => {
        
        const suffix = suffixResult.customSuffix || 'full gameplay';
        const query = queryResult.lastQuery;

        if (query) {
          const finalQuery = query + " " + suffix;
          const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(finalQuery)}`;
          
          chrome.tabs.create({ url: searchUrl });
        }
      });
    });
  }
});