import { remote } from 'electron';
const fs = remote.require('fs');
const DockerAPI = remote.require('dockerode');

class Docker {
  constructor() {
    this.config = {
      socket: '/var/run/docker.sock'
    };
    this.instance = new DockerAPI({
      socketPath: this.config.socket
    });
  }

  getContainers() {
    return this.instance.listContainers({ all: true });
  }

  isRunning() {
    return new Promise((resolve) => {
      const stats = fs.statSync(this.config.socket);
      if (!stats.isSocket()) {
        return resolve(false);
      }
      return this.getContainers()
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }
}

module.exports = new Docker();
