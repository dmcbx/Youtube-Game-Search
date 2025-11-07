function cleanGameTitle(text) {
  if (!text) return null;
  
  let cleaned = text;

  cleaned = cleaned.replace(/^#\d+\s*/, '').replace(/^\d+-\s*/, '');

  const separatorIndex = cleaned.search(/[:–]/); 
  if (separatorIndex !== -1) {
    cleaned = cleaned.substring(0, separatorIndex);
  }

  cleaned = cleaned.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '');
  
  const keywords = [
    'Free Download', 'Build', 'Repack', 'Multiplayer', 'Ultimate Edition',
    'Deluxe Edition', 'Gold Edition', 'Collector\'s Edition', 'Update',
    'по сети', 'Cover zu',
    'v\\d+(\\.\\d+)+',
    '\\+\\s*\\d+\\s*DLCs?',
    '\\+\\s*Multiplayer'
  ];
  
  keywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'gi'); 
    cleaned = cleaned.replace(regex, '');
  });
  
  cleaned = cleaned.trim().replace(/\s+/g, ' ');
  
  return cleaned;
}


document.addEventListener('mousedown', (e) => {
  
  if (e.button === 2) {
    
    let query = null;
    const target = e.target;

    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      query = selectedText;
    }

    if (!query) {
      let foundTitle = null;

      if (target.title) {
        foundTitle = target.title;
      }

      if (!foundTitle) {
        const parentLink = target.closest('a[title]');
        if (parentLink && parentLink.title) {
          foundTitle = parentLink.title;
        }
      }
      
      if (!foundTitle && target.alt) {
        foundTitle = target.alt;
      }
      
      if (!foundTitle) {
        const heading = target.closest('h1, h2, h3, h4, .the-post-title, .entry-title a, a.title');
        if (heading && heading.innerText) {
          foundTitle = heading.innerText;
        }
      }
      
      if (foundTitle) {
        query = cleanGameTitle(foundTitle);
      }
    }

    chrome.runtime.sendMessage({ query: query });
  }
}, true);