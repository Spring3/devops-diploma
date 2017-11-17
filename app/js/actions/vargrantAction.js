import vagrant from 'vagrant';
import Action from './action';

class Vagrant extends Action {
  constructor(store) {
    super();
    this.store = store;
  }
}

module.exports = Vagrant;
