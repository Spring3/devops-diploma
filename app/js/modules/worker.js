const actions = require('../actions.js');

class WebWorker {
  constructor() {
    // firing first time immediately
    actions.checkDocker();
    this.interval = setInterval(actions.checkDocker, 2000);
  }

  stop() {
    clearInterval(this.interval);
  }
}

module.exports.start = () => new WebWorker();
