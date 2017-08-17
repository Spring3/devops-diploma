const os = require('os');
const fs = require('fs');
const DockerAPI = require('dockerode');
const storage = require('electron-json-storage');

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
    storage.get('config', (e, config) => {
      if (Object.keys(config).length > 0) {
        this.connect(config);
      } else {
        this.connect({
          connection: 'socket',
          socket: this.config.socket
        });
      }
    });
  }

  connect(data, save = false) {
    if (!data) {
      return;
    }

    const { connection = '', host = '', port = '', socket = '' } = data;

    const config = {
      connection: connection.trim(),
      host: host.trim() || '127.0.0.1',
      port: parseInt(port, 10) || 2375,
      socket: socket || this.config.socket
    };

    if (save) {
      storage.set('config', config);
    }
    switch (data.connection) {
      case 'url': {
        this.instance = new DockerAPI({
          protocol: 'http',
          host: config.host,
          port: config.port
        });
        break;
      }
      default: {
        this.instance = new DockerAPI({
          socketPath: config.socket
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
    if (!this.instance) {
      return Promise.resolve(false);
    }
    return this.instance.ping()
      .then(() => (true))
      .catch(() => (false));
  }
}

module.exports = new Docker();
