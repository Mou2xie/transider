// open welcome page as soon as extension has been installed.
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({
    url: 'welcome.html'
  });
});

//click the action icon to open the side panel.
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

chrome.runtime.onMessage.addListener((message, sender) => {
  let { tab: { id } } = sender;

  //save the selectedTextInfo in session storage.
  chrome.storage.session.set({ selectedTextInfo: message });

  //open the side panel.
  chrome.sidePanel.open({
    tabId: id
  });
});
