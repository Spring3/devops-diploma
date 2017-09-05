const { remote } = require('electron');
const actions = require('../actions/actions.js');

const { Menu, MenuItem } = remote;

const mouseDownListener = window.addEventListener('mousedown', (e) => {
  switch (e.which) {
    case 3: {
      e.preventDefault();
      const menu = new Menu();
      menu.append(new MenuItem({ type: 'separator' }));
      menu.append(new MenuItem({
        label: 'Prune',
        click: () => {
          if (e.srcElement.innerText.includes('Images')) {
            actions.docker.pruneImages();
          }
        }
      }));
      menu.popup(remote.getCurrentWindow());
      break;
    }
    default: { console.log(e.which); }
  }
});

module.exports = {
  mouseDownListener
};
