function createElement(name, classes = [], attribList = {}, innerHTML = '') {
  const elem = document.createElement(name);
  elem.classList.add(...classes);
  Object.entries(attribList).forEach(([name, value]) => {
    elem.setAttribute(name, value);
  });
  if (innerHTML) {
    elem.innerHTML = innerHTML;
  }
  return elem;
}
function getLinkGroup(data, tabName) {
  const elems = [];
  data.forEach((groupData) => {
    const cardContent = createElement(
      'div',
      ['card', 'col-sm-6', 'col-xl-3', 'col-xxl-2', 'mt-2'],
      { style: 'position: relative;' }
    );
    const cardBody = createElement('div', ['card-body']);
    const groupButton = createElement(
      'button',
      ['btn', 'btn-primary', 'group-open-clicked'],
      { type: 'button', style: 'position: absolute;top: 5px;right: 5px;', 'data-tab-name': tabName, 'data-group-name': groupData.groupName },
      '<i class="bi bi-box-arrow-up-right"></i>'
    );
    const cardTitle = createElement(
      'h5',
      ['card-title'],
      {},
      groupData.groupName
    );
    cardContent.appendChild(cardBody);
    cardContent.appendChild(groupButton);
    cardBody.appendChild(cardTitle);
    groupData.groupLinks.forEach((linkData) => {
      cardBody.appendChild(
        createElement(
          'p',
          [],
          {},
          `<a href="${linkData.url}">${linkData.name}</a>`
        )
      );
    });
    elems.push(cardContent);
  });

  return elems;
}
function getAllTabsHTML(data, selectedTabName) {
  const tabMainContainer = createElement('ul', ['nav', 'nav-tabs']);
  const tabContentContainer = createElement('div', ['tab-content']);

  data.forEach((tabDetails) => {
    contentId = `${tabDetails.tabName}-content`;
    const isSelected = tabDetails.tabName === selectedTabName;
    const tabContainer = createElement('li', ['nav-item']);

    const tabContent = createElement('div', ['tab-pane', 'show', 'row'], {
      id: contentId,
      role: 'tabpanel',
      'arial-labelledby': contentId,
    });
    const tabContentRow = createElement('div', ['row']);
    tabContent.appendChild(tabContentRow);

    tabContentContainer.appendChild(tabContent);
    tabMainContainer.appendChild(tabContainer);
    const tabAnchor = createElement('a', ['nav-link', 'tab-click'], {
      href: '#',
      'aria-current': 'page',
      'aria-controls': contentId,
      'data-tab-name': tabDetails.tabName,
    }, tabDetails.tabName);
    tabContainer.appendChild(tabAnchor);

    if (isSelected) {
      tabAnchor.classList.add('active');
      tabContent.classList.add('active');
      tabAnchor.setAttribute('aria-selected', 'true');
    }
    getLinkGroup(tabDetails.tabContent, tabDetails.tabName).map((elem) =>
      tabContentRow.appendChild(elem)
    );
  });
  return [tabMainContainer, tabContentContainer];
}

function drawUI(data, selectedTabName) {
  const mainContainer = document.getElementById('main-container');
  const editTextarea = document.getElementById('jsoneditor');
  const mainButtonGroup = document.getElementById('button-group-main');
  const editorButtonGroup = document.getElementById('button-group-editor');
  mainContainer.hidden = false;
  editTextarea.hidden = true;
  mainButtonGroup.hidden = false;
  editorButtonGroup.hidden = true;
  let mainDiv = mainContainer.getElementsByClassName('main')[0];
  if (mainDiv) {
    mainContainer.removeChild(mainDiv);
  }
  mainDiv = createElement('div', ['main', 'm-4']);
  getAllTabsHTML(data, selectedTabName).map((child) =>
    mainDiv.appendChild(child)
  );
  mainContainer.appendChild(mainDiv);
}

function drawEditor(data) {
  const mainContainer = document.getElementById('main-container');
  const editorDiv = document.getElementById('jsoneditor');
  const mainButtonGroup = document.getElementById('button-group-main');
  const editorButtonGroup = document.getElementById('button-group-editor');
  mainContainer.hidden = true;
  editorDiv.hidden = false;
  mainButtonGroup.hidden = true;
  editorButtonGroup.hidden = false;
}
