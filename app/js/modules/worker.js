import docker from './docker';

class WebWorker {
  constructor(store) {
    this.store = store;

    this.checkDocker = this.checkDocker.bind(this);

    // firing first time immediately
    this.checkDocker();
    this.interval = setInterval(this.checkDocker, 5000);
  }

  checkDocker() {
    return docker.isRunning()
      .then((result) => {
        this.store.dispatch({
          type: 'UPDATE_DOCKER_DAEMON_STATUS',
          isRunning: result
        });
      });
  }

  stop() {
    clearInterval(this.interval);
  }
}

module.exports.start = store => new WebWorker(store);
