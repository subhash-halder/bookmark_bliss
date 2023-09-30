const state = {
  showUI: 'main',
  selectedTabName: 'main',
  data: [
    {
      tabName: 'main',
      tabContent: [
        {
          groupName: 'example group name',
          groupLinks: [
            {
              url: 'https://google.com',
              name: 'Google',
            },
          ],
        },
      ],
    },
  ],
};

function sendState() {
  chrome.runtime.sendMessage({
    type: 'state',
    data: { state },
  });
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  switch (message.type) {
    case 'getData':
      sendResponse({ state });
      break;
    case 'setSelectedTabName':
      state.selectedTabName = message.tabName;
      sendState();
      break;
    case 'updateData':
      state.data = message.data;
      sendState();
      break;
    case 'showEditor':
      state.showUI = 'editor';
      sendState();
      break;
    case 'openGroup':
      {
        const tabDetails = state.data.find(
          (d) => d.tabName === message.data.tabName
        );
        if (tabDetails) {
          const groupDetails = tabDetails.tabContent.find(
            (d) => d.groupName === message.data.groupName
          );
          if (groupDetails) {
            const tabsCreated = await Promise.all(
              groupDetails.groupLinks.map((g) => {
                return chrome.tabs.create({
                  active: false,
                  url: g.url,
                });
              })
            );
            const tabIds = tabsCreated.map((t) => t.id);
            if (tabIds.length > 0) {
              const groupId = await chrome.tabs.group({
                tabIds,
              });
              chrome.tabGroups.update(groupId, {
                title: message.data.groupName,
              });
            }
          }
        }
        console.log(message.data);
      }
      break;
    case 'showMainUI':
      state.showUI = 'main';
      sendState();
      break;
    default:
  }
});
