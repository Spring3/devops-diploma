const actions = require('../actions/actions.js');

class WebWorker {
  constructor() {
    // firing first time immediately
    actions.docker.check();
    this.interval = setInterval(actions.docker.check, 2000);
  }

  stop() {
    clearInterval(this.interval);
  }
}

module.exports.start = () => new WebWorker();
