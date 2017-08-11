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
    const status = {
      type: 'UPDATE_DOCKER_STATS',
      isRunning: false
    };
    return Promise.all([
      docker.getContainers(true),
      docker.getImages(true),
      docker.getServices(),
      docker.getNodes(),
      docker.getTasks()
    ]).then((result) => {
      Object.assign(status, {
        isRunning: true,
        containers: result[0].length,
        images: result[1].length,
        services: result[2].length,
        nodes: result[3].length,
        tasks: result[4].length
      });
      this.store.dispatch(status);
    }).catch(() => {
      this.store.dispatch(status);
    });
  }

  stop() {
    clearInterval(this.interval);
  }
}

module.exports.start = store => new WebWorker(store);
