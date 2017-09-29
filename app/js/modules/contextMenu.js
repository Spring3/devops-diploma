const { remote } = require('electron');
const actions = require('../actions/actions.js');

const { Menu, MenuItem } = remote;

const mouseDownListener = window.addEventListener('mousedown', (e) => { // eslint-disable-line no-undef
  switch (e.which) {
    case 3: {
      console.log(e);
      e.preventDefault();
      const menu = new Menu();
      const element = e.srcElement;
      if (element.innerText.includes('Images') && element.tagName === 'LI') {
        menu.append(new MenuItem({ label: 'Prune', click: () => actions.docker.image.prune() }));
      } else if (element.parentNode.className.includes('row-image')) {
        menu.append(new MenuItem({
          label: 'Delete',
          click: () => {
            const idPiece = element.parentNode.childNodes[2].innerText;
            const state = actions.store.getState();
            const image = state.docker.images.items.filter(img => img.id.includes(idPiece))[0];
            actions.docker.image.get(image.id).remove();
          }
        }));
      }
      menu.popup(remote.getCurrentWindow());
      break;
    }
    default: { console.log(e.which); }
  }
});

module.exports = {
  mouseDownListener
};
