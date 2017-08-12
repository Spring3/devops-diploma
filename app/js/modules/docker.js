const { remote } = require('electron');

const fs = remote ? remote.require('fs') : require('fs');
const DockerAPI = remote ? remote.require('dockerode') : require('dockerode');

class Docker {
  constructor() {
    this.config = {
      socket: '/var/run/docker.sock'
    };
    const stats = fs.statSync(this.config.socket);
    if (!stats.isSocket()) {
      throw new Error('Unable to locate docker daemon');
    }

    this.instance = new DockerAPI({
      socketPath: this.config.socket
    });
  }

  getContainers(all = false) {
    return this.instance.listContainers({ all });
  }

  getImages(all = false) {
    return this.instance.listImages({ all });
  }

  getServices() {
    return this.instance.listServices();
  }

  getNodes() {
    return this.instance.listNodes();
  }

  getTasks() {
    return this.instance.listTasks();
  }

  getVersion() {
    return this.instance.version();
  }

  isRunning() {
    return new Promise(resolve => this.instance.ping()
      .then(() => resolve(true))
      .catch(() => resolve(false))
    );
  }
}

module.exports = new Docker();
