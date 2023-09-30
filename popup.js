const urlInput = document.getElementById('url');
const urlTitleInput = document.getElementById('title');
const selectTab = document.getElementById('select-tab');
const newTab = document.getElementById('new-tab');
const selectGroup = document.getElementById('select-group');
const newGroup = document.getElementById('new-group');
const saveButton = document.getElementById('save-data');

chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  const url = tabs[0].url;
  urlTitleInput.value = tabs[0].title;
  urlInput.value = url;
});

chrome.runtime.sendMessage({ type: 'getData' }, (response) => {
  function populateGroupOption() {
    const tabValue = selectTab.value;
    const tabDetails = response.state.data.find(
      (tab) => tab.tabName === tabValue
    );
    if (tabDetails) {
      selectGroup.innerHTML = tabDetails.tabContent.map(
        (t) => `<option value="${t.groupName}">${t.groupName}</option>`
      );
    } else {
      selectGroup.innerHTML = '';
    }
  }
  selectTab.addEventListener('change', () => {
    populateGroupOption();
  });
  selectTab.innerHTML = response.state.data
    .map((d) => `<option value="${d.tabName}">${d.tabName}</option>`)
    .join('');
  populateGroupOption();
});

saveButton.addEventListener('click', () => {
  const url = urlInput.value;
  const urlTitle = urlTitleInput.value;
  const tabName = newTab.value || selectTab.value;
  const groupName = newGroup.value || selectGroup.value;

  if (url && urlTitle && tabName && groupName) {
    chrome.runtime.sendMessage(
      {
        type: 'addNewData',
        data: {
          tabName,
          groupName,
          url,
          urlTitle,
        },
      },
      () => {
        window.close();
      }
    );
  }
});
