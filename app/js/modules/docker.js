const os = require('os');
const fs = require('fs');
const DockerAPI = require('dockerode');

class Docker {
  constructor() {
    this.config = {
      socket: os.platform() === 'win32' ? '//./pipe/docker_engine' : '/var/run/docker.sock',
      registry: 'https://index.docker.io/v1'
    };
    const stats = fs.statSync(this.config.socket);
    if (!stats.isSocket()) {
      throw new Error('Unable to locate docker daemon');
    }

    this.connect({
      type: 'socket',
      socket: this.config.socket
    });
  }

  connect(data) {
    if (!data) {
      return;
    }

    switch (data.connection) {
      case 'url': {
        this.instance = new DockerAPI({
          protocol: 'http',
          host: data.host.trim() ? data.host : '127.0.0.1',
          port: parseInt(data.port.trim(), 10) || 2375
        });
        break;
      }
      default: {
        this.instance = new DockerAPI({
          socketPath: data.socket.trim() || this.config.socket
        });
        break;
      }
    }
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
