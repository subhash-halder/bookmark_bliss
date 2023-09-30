let editor;

function draw(data) {
  const state = data.state;
  if (state.showUI === 'editor') {
    drawEditor(state.data);
    const container = document.getElementById('jsoneditor');

    const schema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          tabName: {
            type: 'string',
          },
          tabContent: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                groupName: {
                  type: 'string',
                },
                groupLinks: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      url: {
                        type: 'string',
                      },
                      name: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
    const options = {
      // schema,
      // allowSchemaSuggestions: true,
      mode: 'code',
      modes: ['code', 'form', 'text', 'tree', 'view', 'preview'],
    };
    editor = new JSONEditor(container, options);
    editor.set(state.data);
    // editor.setSchema(schema);
  } else {
    drawUI(state.data, state.selectedTabName);

    Array.from(document.getElementsByClassName('tab-click')).forEach((elem) => {
      elem.addEventListener('click', function () {
        chrome.runtime.sendMessage({
          type: 'setSelectedTabName',
          tabName: this.getAttribute('data-tab-name'),
        });
      });
    });

    Array.from(document.getElementsByClassName('group-open-clicked')).forEach((elem) => {
      elem.addEventListener('click', function () {
        chrome.runtime.sendMessage({
          type: 'openGroup',
          data: {
            tabName: this.getAttribute('data-tab-name'),
            groupName: this.getAttribute('data-group-name')
          }
        });
      });
    });
  }
}

chrome.runtime.onMessage.addListener((message, sender) => {
  switch (message.type) {
    case 'state':
      draw(message.data);
      break;
    default:
  }
});

chrome.runtime.sendMessage({ type: 'getData' }, (response) => {
  draw(response);
  document.getElementById('button-group-main-edit').onclick = () => {
    chrome.runtime.sendMessage({ type: 'showEditor' });
  };

  document.getElementById('button-group-editor-cancel').onclick = () => {
    chrome.runtime.sendMessage({ type: 'showMainUI' });
  };

  document.getElementById('button-group-editor-save').onclick = () => {
    const updatedData = editor.get();
    console.log(updatedData);
    chrome.runtime.sendMessage({ type: 'updateData', data: updatedData });
    chrome.runtime.sendMessage({ type: 'showMainUI' });
  };
});
